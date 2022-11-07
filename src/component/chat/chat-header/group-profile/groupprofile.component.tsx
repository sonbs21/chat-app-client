import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../redux/reducers';
import './groupprofile.styles.scss';
import {
  faCaretDown,
  faCaretRight,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IMessage } from '../../../../redux/types/ChatTypes';
import { dateUtils } from '../../../../utils/dateUtils';
import {
  deleteMessageAllMeRequest,
  getAllConversationByUserRequest,
  getAllMessageByConversationRequest,
  getConversationByIdRequest,
  leaveGroupRequest,
} from '../../../../redux/actions/ChatAction';
import ModalMember from './modal-member/modalmember.component';
import { showOptionGroupProfile } from '../../../../redux/actions/OptionLayoutAction';
import ModalChangeGroup from './modal-change-group/modalChangeGroup.component';
const GroupProfile = () => {
  const dispatch = useDispatch();
  const { userCurrent }: any = useSelector<RootState>((state) => state.user);
  const { chatWith, listMessage }: any = useSelector<RootState>(
    (state) => state.chat
  );
  const { socket }: any = useSelector<RootState>((state) => state);

  const [showListImage, setShowListImage] = useState(false);
  const [showListFile, setShowListFile] = useState(false);
  const [showViewMember, setShowViewMember] = useState(false);
  const [showUpdateGroup, setShowUpdateGroup] = useState(false);
  const handleClose = (): void => {
    setShowUpdateGroup(false);
  };
  console.log(userCurrent);
  // useEffect(() => {
  //   socket.on('kickMemberOutGroupSuccess', (conversationId: string) => {
  //     console.log('kickMemberOutGroupSuccess');
  //     dispatch(getConversationByIdRequest(conversationId));
  //   });
  // }, [socket]);

  const handelShowViewMember = () => {
    setShowViewMember(true);
  };

  const handelCloseViewMember = () => {
    setShowViewMember(false);
  };

  const handleShowListImage = () => {
    setShowListImage(!showListImage);
  };

  const handleShowListFile = () => {
    setShowListFile(!showListFile);
  };

  const handleDeleteAll = () => {
    const data: any = {
      idConversation: chatWith.idConversation,
      userId: userCurrent._id,
    };
    dispatch(deleteMessageAllMeRequest(data));
    dispatch(getAllMessageByConversationRequest(chatWith.idConversation));
  };

  const handleLeaveGroup = () => {
    const data = {
      conversation: chatWith,
      idConversation: chatWith.idConversation,
      userId: userCurrent._id,
    };
    dispatch(leaveGroupRequest(data));
    dispatch(getAllConversationByUserRequest(userCurrent._id));

    // dispatch(getConversationByIdRequest(userCurrent._id));
    dispatch(showOptionGroupProfile(false));

    socket.emit('leaveGroup', data);
  };

  const renderListImage = (message: IMessage) => {
    const flag = message.deleteBy?.findIndex(
      (userIdele) => userIdele == userCurrent._id
    );
    console.log(message.type === 'IMAGE' && flag === -1);
    return message.type === 'IMAGE' && flag === -1 ? (
      <img className="item-image" src={message.url} alt="avatar" />
    ) : (
      ''
    );
  };

  const renderListFile = (item: IMessage) => {
    const flag = item.deleteBy?.findIndex(
      (userIdele) => userIdele == userCurrent._id
    );
    return item.type === 'FILE' && flag === -1 ? (
      <div>
        <a href={item.url}>{item.message}</a>
      </div>
    ) : (
      ''
    );
  };

  return (
    <div className="other_profile_container">
      <div className="OPH--heading">
        <span className="OPH--title">Thông tin nhóm</span>
      </div>
      <div className="__scroll">
        <div className="OP--imageContainer">
          <div className="OP-img_container">
            <img src={chatWith.avatar} alt="avatar"></img>
          </div>

          <div className="OPIC--txtContainer">
            <span className="OPIC--title">{chatWith.name}</span>
            <div
              className="OPIC--update"
              onClick={() => {
                setShowUpdateGroup(true);
              }}
            >
              <i className="fal fa-edit"></i>
            </div>
            {showUpdateGroup && (
              <ModalChangeGroup
                open={showUpdateGroup}
                handleClose={handleClose}
              ></ModalChangeGroup>
            )}
          </div>
        </div>
        <div className="list-member" onClick={handelShowViewMember}>
          <div className="header">
            <span className="header-title">Thành viên nhóm</span>
            <div>{`${chatWith.members.length}`} thành viên</div>
          </div>
        </div>
        {showViewMember && (
          <ModalMember
            open={showViewMember}
            handleClose={handelCloseViewMember}
          ></ModalMember>
        )}
        <div className="list-image">
          <div className="header">
            <span className="header-title">Ảnh</span>
            <div onClick={handleShowListImage}>
              {showListImage ? (
                <FontAwesomeIcon className="icon" icon={faCaretDown} />
              ) : (
                <FontAwesomeIcon className="icon" icon={faCaretRight} />
              )}
            </div>
          </div>
          {showListImage && (
            <div className="body">
              {/* render image (map) after */}
              <div className="body-list-image">
                {listMessage.map((message: IMessage) => {
                  return (
                    <div key={message._id}>{renderListImage(message)}</div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="list-image">
          <div className="header">
            <span className="header-title">File</span>
            <div onClick={handleShowListFile}>
              {showListFile ? (
                <FontAwesomeIcon className="icon" icon={faCaretDown} />
              ) : (
                <FontAwesomeIcon className="icon" icon={faCaretRight} />
              )}
            </div>
          </div>
          {showListFile && (
            <div className="body">
              {/* render image (map) after */}
              <div className="body-list-file">
                {listMessage.map((item: IMessage) => {
                  return <div key={item._id}>{renderListFile(item)}</div>;
                })}
              </div>
            </div>
          )}
        </div>
        <div className="actu-item" onClick={() => handleDeleteAll()}>
          <i className="fal fa-trash"></i>
          <span>Xóa cuộc trò chuyện</span>
        </div>
        <div className="actu-item" onClick={() => handleLeaveGroup()}>
          <FontAwesomeIcon className="icon" icon={faTrashAlt} />

          <span>Rời cuộc trò chuyện</span>
        </div>
        {chatWith.leaderId === userCurrent._id && (
          <div className="actu-item">
            <FontAwesomeIcon className="icon" icon={faTrashAlt} />

            <span>Giải tán nhóm</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupProfile;