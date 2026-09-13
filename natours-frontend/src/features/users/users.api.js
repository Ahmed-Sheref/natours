import { apiClient } from '../../api/client';

// updateMe currently only allows name/email on the backend (see
// UserController.updateMe's filterObject allow-list) — photo support needs a
// small backend addition (multer on this route + `photo` added to the
// allow-list, see the chat message for the reference patch). Sent as
// multipart so it works the moment that lands, without changing this function
// again. `headers: { 'Content-Type': undefined }` drops our client's default
// 'application/json' so the browser can set the correct multipart boundary
// itself — setting it manually here would break the upload.
export async function updateProfile({
    name,
    email,
    photo
}) {

    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);

    if (photo) {
        formData.append('photo', photo);
    }

    const response = await apiClient.patch(
        '/users/updateMe',
        formData
    );

    return response.data.newUser;
}