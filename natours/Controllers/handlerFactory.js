const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
class API_Features 
{
    constructor(Query , queryStr)
    {
        this.Query = Query;
        this.queryStr = queryStr;
    }

    filter()
    {
        let queryObj = {...this.queryStr};
        
        let Special_Operation = ['sort' , 'limit' , 'page' , 'fields']
        
        Special_Operation.forEach(op => {delete queryObj[op]});
        console.log(queryObj);

        // Handle query to match specific syntax for Mongooes
        queryObj = JSON.stringify(queryObj);
        let queryStr = queryObj.replace(/"(\w+)\[(gte|gt|lte|lt)\]":"?([^"]+)"?/g,'"$1":{"$$$2":"$3"}');
        queryStr = JSON.parse(queryStr);
        this.Query = this.Query.find(queryStr);
        return this;
    }

    sort()
    {
        let QuerySort = this.queryStr.sort;
        if (QuerySort)
        {
            console.log('before =', QuerySort);
            QuerySort = QuerySort.split(',').join(' ');
            console.log('after  =', QuerySort);
            this.Query = this.Query.sort(QuerySort);
        }
        return this;
    }

    limit()
    {
        let Querylimit = this.queryStr.limit ? this.queryStr.limit * 1 : 10;
        let Querypage  = this.queryStr.page  ? this.queryStr.page  * 1 : 1;

        let Queryskip = (Querypage - 1) * Querylimit;

        this.Query = this.Query.skip(Queryskip).limit(Querylimit);
        return this;
    }
}

exports.deleteOne = Model => catchAsync(async (req, res, next) => 
{
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with that ID', 404));
    res.status(200).json({ status: 'success', data: null });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => 
{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, 
    {
        new: true,
        runValidators: true
    });
    if (!doc) return next(new AppError('No document found with that ID', 404));
    res.status(200).json({ status: 'success', data: { data: doc } });
});

exports.createOne = Model => catchAsync(async (req, res, next) => 
{
    const doc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: { data: doc } });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => 
{
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json(
    {
        status: 'success',
        data: { data: doc }
    });
});

exports.getAll = Model => catchAsync(async (req, res, next) => 
{
    let filter = {};
    if (req.params.tour) filter = { tour: req.params.tour };

    const features = new API_Features(Model.find(filter), req.query)
        .filter()
        .sort()
        .limit();

    const doc = await features.Query;

    res.status(200).json(
    {
        status: 'success',
        results: doc.length,
        data: { data: doc }
    });
});