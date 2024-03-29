import React, { FormEvent, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/reducers';
import './modalChangeGroup.styles.scss';
import { useForm } from 'react-hook-form';
import {
  changeAvatarGroupRequest,
  changeNameGroupRequest,
} from '../../../../../redux/actions/ChatAction';
const ModalChangeGroup = ({ open, handleClose }: any) => {
  const [previewSource, setPreviewSource] = useState<any>('');
  const { chatWith }: any = useSelector<RootState>((state) => state.chat);
  const { userCurrent }: any = useSelector<RootState>((state) => state.user);
  const [image, setImage] = useState('');
  const dispatch = useDispatch();
  const [name, setName] = useState(chatWith.name);

  const { register, handleSubmit } = useForm();

  const onSubmit = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('idUser', userCurrent._id);
      formData.append('idConversation', chatWith.idConversation);
      formData.append('image', image);
      await dispatch(changeAvatarGroupRequest(formData));
      // await dispatch(getUserByIdRequest(userCurrent._id));
    }

    const data = {
      nameGroup: name,
      idConversation: chatWith.idConversation,
      idUser: userCurrent._id,
    };

    if (data) {
      await dispatch(changeNameGroupRequest(data));
    }

    handleClose();
  };

  const handleFileInputChange = (e: any) => {
    setPreviewSource('');
    const files = e.target.files;

    const fileImage = files[0];
    const reader = new FileReader();
    if (fileImage && fileImage.type.match('image.*')) {
      reader.readAsDataURL(fileImage);
      reader.onloadend = function (e) {
        setPreviewSource(reader.result);
      };
    }
    setImage(fileImage);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <form className="dialog-update-group" onSubmit={handleSubmit(onSubmit)}>
          <div className="title">
            <span>Cập nhật thông tin nhóm</span>
            <div className="close" onClick={() => handleClose()}></div>
          </div>
          <div className="avatar">
            <div className="img">
              {previewSource.length > 0 ? (
                <img src={previewSource} alt="Red dot" />
              ) : (
                <div>
                  <img src={chatWith.avatar} alt="avatar"></img>
                </div>
              )}

              <div className="update">
                <label htmlFor="input_file">
                  <i className="fal fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="input_file"
                  {...register('image')}
                  defaultValue=""
                  onChange={handleFileInputChange}
                ></input>
              </div>
            </div>
          </div>
          {/* <div className="email">
            <label>Email: </label>
            <span>{userCurrent.email}</span>
          </div> */}
          <div className="infos">
            <div className="name">
              <input
                type="text"
                defaultValue={chatWith.name}
                //  {...register('email')}
                // value={name ? name : userCurrent.name}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  setName(e.currentTarget.value)
                }
                required
              ></input>
            </div>
          </div>
          <div className="btn">
            <button className="cancel" onClick={() => handleClose()}>
              Hủy
            </button>
            <button type="submit" className="search">
              Cập nhật
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalChangeGroup;
