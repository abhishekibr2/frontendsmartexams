"use client"
import './style.css'
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import RightSection from './RightSection';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import TextArea from 'antd/es/input/TextArea';
import ErrorHandler from '@/lib/ErrorHandler';
import ParaText from '@/app/commonUl/ParaText';
import { FaRegMessage } from 'react-icons/fa6';
import { useAppDispatch } from '@/redux/hooks';
import AuthContext from '@/contexts/AuthContext';
import { validationRules } from '@/lib/validations';
import React, { useContext, useEffect } from 'react';
import RelativeTime from '@/app/commonUl/RelativeTime';
import { Row, Col, Form, Button, Avatar, Tooltip, Modal, Result, Image, Timeline } from 'antd';
import { forumQuestionViews, submitForumComment, submitForumReply, submitForumVote, deleteComment } from '@/lib/frontendApi';
import { setComment, setCommentBox, setReply, setModal, setForumResult, setForumId, setData } from '@/redux/reducers/forumReducer';
import { LikeOutlined, ArrowLeftOutlined, DislikeOutlined, UserOutlined, MessageOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';

interface Props {
   forumData?: any;
}

export default function SingleForum({ forumData }: Props) {
   const router = useRouter();
   const [form] = Form.useForm();
   const dispatch = useAppDispatch();
   const { user } = useContext(AuthContext);
   const data = useSelector((state: RootState) => state.forumReducer.data)
   const reply = useSelector((state: RootState) => state.forumReducer.reply)
   const modal = useSelector((state: RootState) => state.forumReducer.modal)
   const forumId = useSelector((state: RootState) => state.forumReducer.forumId)
   const comment = useSelector((state: RootState) => state.forumReducer.comment)
   const commentBox = useSelector((state: RootState) => state.forumReducer.commentBox)
   const forumResult = useSelector((state: RootState) => state.forumReducer.forumResult)

   useEffect(() => {
      const timeout = setTimeout(() => {
         fetchViewsData();
      }, 5000);

      return () => clearTimeout(timeout);
   }, []);

   const fetchViewsData = async () => {
      try {
         const response = await fetch('https://ip-api.com/json?fields=status,message,country,district,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,query');
         const data = await response.json();
         const browserName = getBrowserName(navigator.userAgent);
         const operatingSystem = navigator.platform;
         const deviceName = getDeviceName(navigator.userAgent);

         const viewsData = {
            ...data,
            forumId: forumData?._id,
            browserName: browserName,
            operatingSystem: operatingSystem,
            deviceName: deviceName
         };

         await forumQuestionViews(viewsData);
      } catch (error) {
         console.error("Fetch error:", error);
         ErrorHandler.showNotification(error);
      }
   };

   const getDeviceName = (userAgent: string): string => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const isTablet = /iPad/i.test(userAgent);
      const isDesktop = !isMobile && !isTablet;

      if (isMobile) {
         return 'Mobile';
      } else if (isTablet) {
         return 'Tablet';
      } else if (isDesktop) {
         return 'Desktop';
      } else {
         return 'unknown';
      }
   };

   const getBrowserName = (userAgent: string): string => {
      const match = userAgent.match(/(chrome|firefox|safari|edge|msie|trident(?=\/))\/?\s*(\d+)/i);
      if (match && match[1]) {
         return match[1].toLowerCase();
      } else {
         return 'unknown';
      }
   };

   const handleSubmit = async () => {
      try {
         if (!user) {
            dispatch(setModal(true));
            return;
         }
         const data = {
            forumId: forumData?._id,
            comment: comment,
            userId: user?._id
         }

         const res = await submitForumComment(data);
         if (res.status == true) {
            dispatch(setForumResult(res.data));
            dispatch(setComment(''));
            dispatch(setCommentBox(false));
            form.resetFields();
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   };

   const handleVote = async (commentId: string, replyId: string, vote: string) => {

      try {
         if (!user) {
            dispatch(setModal(true));
            return;
         }
         const data = {
            forumId: forumData?._id,
            commentId: commentId,
            userId: user?._id,
            type: vote,
            replyId: replyId
         }

         const res = await submitForumVote(data);

         if (res) {
            dispatch(setData(res.data));
            dispatch(setForumResult(res.data))
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   }

   let dataSource: any;
   if (forumResult && forumResult?.comments?.length > 0) {
      dataSource = forumResult;
   } else {
      dataSource = data;
   }

   const handleComment = (commentId: string) => {
      dispatch(setCommentBox(true));
      if (commentId == forumId) {
         dispatch(setForumId(''));
      } else {
         dispatch(setForumId(commentId));
      }
   }

   const handleSubmitReply = async (commentId: string) => {
      try {
         if (!user) {
            dispatch(setModal(true));
            return;
         }
         const replyData = {
            forumId: data?._id,
            commentId: commentId,
            userId: user?._id,
            message: reply
         }

         const res = await submitForumReply(replyData);
         if (res.status == true) {
            dispatch(setForumResult(res.data));
            dispatch(setReply(''));
            form.resetFields();
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   }

   const deleteUserComments = async (commentId: string) => {
      try {
         const commentData = {
            id: user?._id,
            commentId: commentId,
            forumId: data?._id,
         };
         const response = await deleteComment(commentData);
         if (response.success == true) {
            dispatch(setReply(''));
            form.resetFields();

            const currentComments = forumResult?.comments || [];
            const newData = currentComments.filter((comment: any) => comment._id !== commentId);
            dispatch(setData({ ...forumResult, comments: newData }));
            dispatch(setForumResult({ ...forumResult, comments: newData }));
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   };

   return (
      <>
         <div className='gapMarginTop'></div>
         <div className="customContainer">
            <div className='contentBody'>
               <Row justify='center' gutter={[12, 12]}>
                  <Col md={1}>
                     <div>
                        <ArrowLeftOutlined className='backArrowIcon' onClick={() => {
                           router.back()
                        }} />
                     </div>
                  </Col>
                  <Col md={15}>
                     <Image
                        width="100%"
                        height={600}
                        alt="logo"
                        src={
                           data?.attachment
                              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/forumImages/original/${data.attachment}`
                              : '/images/default.png'
                        }
                        preview={false}
                        onError={(e) => {
                           e.currentTarget.onerror = null;
                           e.currentTarget.src = '/images/default.png';
                        }}
                     />
                     <div className='gapMarginTop'></div>
                     <div style={{ padding: "4px" }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                           <div style={{ marginTop: '15px' }}>
                              {data?.userId?.image ?
                                 <Image
                                    src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${data?.userId?.image}`
                                    }
                                    alt="Avatar"
                                    width="50px"
                                    height="50px"
                                    style={{ borderRadius: '50px' }}
                                    preview={false}
                                 />
                                 :
                                 <Avatar size={50} icon={<UserOutlined />} />
                              }
                           </div>
                           <div style={{ marginTop: '14px' }}>
                              <span style={{ fontSize: '20px' }}>
                                 {data?.userId?.name}
                              </span>
                              <div className="gapMarginTopOne"></div>
                              <div>
                                 <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                                    {data?.title}
                                 </ParaText>
                                 <div className="gapMarginTopOne"></div>
                                 <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                                 <div className="mediumTopMargin"></div>

                                 {/* FORUM LIKES & DISLIKES */}
                                 <div className="gapPaddingTopOTwo"></div>
                                 <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ cursor: 'pointer' }} onClick={() => handleVote('', '', 'like')}>
                                       {
                                          data?.likes?.includes(user?._id)
                                             ? <LikeFilled />
                                             : <LikeOutlined />
                                       }
                                       {data?.likes?.length}
                                    </div>
                                    <div style={{ cursor: 'pointer' }} onClick={() => handleVote('', '', 'dislike')}>
                                       {
                                          data?.dislikes?.includes(user?._id)
                                             ? <DislikeFilled />
                                             : <DislikeOutlined />
                                       } {data?.dislikes?.length}
                                    </div>
                                    <div style={{ cursor: 'pointer' }} >
                                       <MessageOutlined /> {data?.comments?.length}
                                    </div>
                                    <div className="smallTopMargin"></div>
                                 </div>
                                 <div className='textEnd' >
                                    <span><RelativeTime date={data?.createdAt} /></span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="mediumTopMargin"></div>
                        {dataSource?.comments?.length > 0 &&
                           <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                              Comments
                           </ParaText>
                        }
                     </div>

                     <div className="gapPaddingTopOTwo"></div>

                     {/* COMMENTS LOOP */}
                     <Row>
                        {dataSource?.comments?.map((comment: any, index: any) => (
                           comment &&
                           <>
                              <div className="smallTopMargin"></div>
                              <Col md={24} key={index}>
                                 <div style={{ display: 'flex', gap: '8px' }}>
                                    <div>
                                       {comment?.userId?.image ?
                                          <Image
                                             src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${comment?.userId?.image}`
                                             }
                                             alt="Avatar"
                                             width="40px"
                                             height="40px"
                                             style={{ borderRadius: '50px' }}
                                             preview={false}
                                          />
                                          :
                                          <Avatar icon={<UserOutlined />} />
                                       }
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }} >
                                       <div>
                                          <span style={{ fontSize: '14px' }}>
                                             {comment?.userId?.name}
                                          </span>
                                       </div>


                                       <div > <span ><RelativeTime date={comment?.createdAt} /></span></div>
                                    </div>
                                 </div>

                                 <div className="smallTopMargin"></div>

                                 {/* COMMENT MESSAGE */}
                                 <div className='descriptionMargin'>
                                    <div dangerouslySetInnerHTML={{ __html: comment?.message }}></div>
                                    <div className="gapPaddingTopOTwo"></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                       <div style={{ display: 'flex', gap: '10px' }}>
                                          <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, '', 'like')}>
                                             {
                                                comment?.likes?.includes(user?._id)
                                                   ? <LikeFilled />
                                                   : <LikeOutlined />
                                             }
                                             {comment?.likes?.length}
                                          </div>
                                          <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, '', 'dislike')}>
                                             {
                                                comment?.dislikes.includes(user?._id)
                                                   ? <DislikeFilled />
                                                   : <DislikeOutlined />
                                             } {comment?.dislikes.length}
                                          </div>
                                          <div style={{ cursor: 'pointer' }} onClick={() => handleComment(comment._id)}>
                                             <FaRegMessage /> {comment?.replies.length} { }
                                          </div></div>
                                       {user?._id ?
                                          <div className='textEnd' style={{ height: '38px' }}><Button onClick={() => deleteUserComments(comment._id)}>Delete</Button></div> : ''}
                                       {!commentBox && forumId == comment._id &&
                                          <div style={{ cursor: 'pointer' }} onClick={() => dispatch(setCommentBox(true))}>
                                             <Button
                                                type='link'
                                             >
                                                Add reply
                                             </Button>
                                          </div>
                                       }
                                    </div>
                                 </div>
                                 <div className="gapPaddingTopOTwo"></div>
                              </Col>

                              {/* REPLY TEXTAREA */}
                              {commentBox && forumId == comment._id ?
                                 <>
                                    <Col md={3}></Col>
                                    <Col md={21}>
                                       {commentBox &&
                                          <div className='replyDivBorder'>
                                             <div className='customTextArea'>
                                                <TextArea rows={1} value={reply} onChange={(e) => {
                                                   if (!user) {
                                                      dispatch(setModal(true));
                                                      return;
                                                   }
                                                   dispatch(setReply(e.target.value))
                                                }
                                                }
                                                   placeholder='Add a reply ...'
                                                   maxLength={validationRules.textEditor.maxLength}
                                                   minLength={validationRules.textEditor.minLength}
                                                />
                                             </div>
                                             <div>

                                             </div>
                                          </div>
                                       }
                                    </Col>
                                    <div>
                                       {reply &&
                                          <div style={{ paddingTop: '4px' }}>
                                             <div style={{ display: 'flex', gap: '10px', justifyContent: 'end' }} className="textEnd">
                                                <div>
                                                   <Button htmlType="submit" color='primary' onClick={() => handleSubmitReply(comment._id)}>
                                                      Submit
                                                   </Button>
                                                </div>
                                                <div>
                                                   <Button htmlType="submit" color='primary' onClick={() => dispatch(setCommentBox(false))}>
                                                      Cancel
                                                   </Button>
                                                </div>
                                             </div>
                                          </div>
                                       }
                                    </div>
                                    <div className="mediumTopMargin"></div>
                                 </>
                                 : null
                              }

                              {/* REPLIES LOOP */}
                              {forumId == comment._id &&
                                 <>
                                    <Col md={3}></Col>
                                    <Col md={21}>
                                       {comment?.replies?.length > 0 &&
                                          <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                                             Replies
                                          </ParaText>
                                       }
                                       <div className="smallTopMargin"></div>
                                       {
                                          comment?.replies?.map((reply: any, index: any) => {
                                             return (
                                                <Timeline key={index}>
                                                   <Timeline.Item key={index}>
                                                      <Row>
                                                         <Col md={21}>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                               <div>
                                                                  <Tooltip
                                                                     color={''}
                                                                     title={(
                                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                           <div>
                                                                              {reply.userId?.image ?
                                                                                 <Image
                                                                                    src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${reply.userId.image}`}
                                                                                    alt="Avatar"
                                                                                    width="40px"
                                                                                    height="40px"
                                                                                    style={{ borderRadius: '50px' }}
                                                                                    preview={false}
                                                                                 />
                                                                                 :
                                                                                 <Avatar icon={<UserOutlined />} />
                                                                              }
                                                                           </div>
                                                                           <div>
                                                                              <span style={{ fontSize: '14px' }}>
                                                                                 {reply.userId?.name}
                                                                              </span>
                                                                              <br />
                                                                              <span><RelativeTime date={reply.createdAt} /></span>
                                                                              <br />
                                                                              <span>{reply.userId?.email}</span>
                                                                           </div>
                                                                        </div>
                                                                     )}
                                                                  >
                                                                     {reply.userId?.image ?
                                                                        <Image
                                                                           src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${reply.userId.image}`}
                                                                           alt="Avatar"
                                                                           width="40px"
                                                                           height="40px"
                                                                           style={{ borderRadius: '50px' }}
                                                                           preview={false}
                                                                        />
                                                                        :
                                                                        <Avatar size={40} icon={<UserOutlined />} />
                                                                     }
                                                                  </Tooltip>
                                                               </div>
                                                               <div>
                                                                  <span style={{ fontSize: '14px' }}>
                                                                     {reply.userId?.name}
                                                                  </span><br />
                                                                  <span><RelativeTime date={reply.createdAt} /></span>
                                                               </div>
                                                            </div>

                                                            <div className="smallTopMargin"></div>
                                                            <div className='descriptionMargin'>
                                                               <div dangerouslySetInnerHTML={{ __html: reply?.message }}></div>
                                                               <div className="smallTopMargin"></div>
                                                               <div style={{ display: 'flex', gap: '10px' }}>
                                                                  <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, reply._id, 'like')}>
                                                                     {reply.likes.includes(user?._id)
                                                                        ? <LikeFilled />
                                                                        : <LikeOutlined />
                                                                     } {reply.likes.length}
                                                                  </div>
                                                                  <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, reply._id, 'dislike')}>
                                                                     {reply.dislikes.includes(user?._id)
                                                                        ? <DislikeFilled />
                                                                        : <DislikeOutlined />
                                                                     } {reply.dislikes.length}
                                                                  </div>
                                                               </div>
                                                            </div>
                                                            <div className="smallTopMargin"></div>
                                                         </Col>
                                                      </Row>
                                                   </Timeline.Item>
                                                </Timeline>
                                             );
                                          })
                                       }
                                    </Col>
                                 </>}
                           </>
                        ))}
                     </Row>


                     {/* COMMENT TEXTBOX */}
                     <div className='replyDivBorder'>
                        <div className='customTextArea'>
                           <TextArea rows={1} value={comment} onChange={(e) => {
                              if (!user) {
                                 dispatch(setModal(true));
                                 return;
                              }
                              dispatch(setComment(e.target.value))
                           }
                           }
                              placeholder='Add a comment ...'
                              maxLength={validationRules.textEditor.maxLength}
                              minLength={validationRules.textEditor.minLength}
                           />
                        </div>
                     </div>
                     <div>
                        {comment &&
                           <div style={{ paddingTop: '4px' }}>
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'end' }} className="textEnd">
                                 <div>
                                    <Button htmlType="submit" color='primary' onClick={() => handleSubmit()}>
                                       Submit
                                    </Button>
                                 </div>
                                 <div>
                                    <Button htmlType="submit" color='primary' onClick={() => { dispatch(setCommentBox(false)), dispatch(setComment('')) }}>
                                       Cancel
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        }
                     </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                     <RightSection />
                  </Col>
               </Row>
               <Modal
                  open={modal}
                  onCancel={() => dispatch(setModal(false))}
                  footer={null}
               >
                  <Result
                     status="info"
                     title="You need to be logged in to perform this action"
                     extra={
                        <Button type='primary' ghost
                           style={{ height: '40px' }}
                           onClick={() => router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)}>
                           Login
                        </Button>
                     }
                  />
               </Modal>
            </div>
         </div>
      </>
   )
}

