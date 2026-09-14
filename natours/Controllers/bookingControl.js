const Tour = require('./../Models/tourModel');
const Booking = require('./../Models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => 
{
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) 
    {
        return next(new appError('No tour found with that ID', 404));
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        success_url:`${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${process.env.FRONTEND_URL}/tours/${tour.id}`,
        customer_email: req.user.email,
        client_reference_id: tour.id,
        metadata: 
        {
            userId: req.user.id,
            tourId: tour.id
        },

        line_items: 
        [
            {
                price_data: 
                {
                    currency: 'usd',
                    unit_amount: Math.round(tour.price * 100),
                    product_data: 
                    {
                        name: `${tour.name} Tour`,
                        description: tour.summary
                    }
                },
                quantity: 1
            }
        ]
    });

    res.status(200).json(
    {
        status: 'success',
        session
    });
});


const createBookingFromCheckout = async (session) => 
{
    // We only fulfill paid Checkout Sessions
    if (session.payment_status !== 'paid') return;

    const tourId = session.metadata?.tourId || session.client_reference_id;
    const userId = session.metadata?.userId;

    if (!tourId || !userId) 
    {
        throw new Error('Checkout Session is missing tourId or userId');
    }

    await Booking.findOneAndUpdate(
    {
        stripeSessionId: session.id
    },

    {
        $setOnInsert: 
        {
            tour: tourId,
            user: userId,

            price: session.amount_total / 100,
            currency: session.currency,
            stripeSessionId: session.id,
            stripePaymentIntentId:session.payment_intent || undefined
        },

        $set: 
        {
            paid: true
        }
    },

    {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }
    );
};

exports.webhookCheckout = async (req, res) => 
{
    const signature = req.headers['stripe-signature'];
    let event;

    try 
    {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } 
    catch (err) 
    {
        console.error('Stripe webhook signature failed:',err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try 
    {
        if (event.type === 'checkout.session.completed') 
        {
            const session = event.data.object;
            await createBookingFromCheckout(session);
        }

        return res.status(200).json({received: true});
    } 
    catch (err) 
    {
        console.error('Webhook processing failed:',err);
        return res.status(500).json({received: false});
    }
};