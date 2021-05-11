import Playerlayout from 'components/dashboard/PlayerLayout';
import React, { createRef, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia } from 'redux/slices/mediaSlice';
import {
  setComments,
  createComment,
  updateComment,
  deleteComment,
} from 'redux/slices/commentSlice';
import { useRouter } from 'next/router';
import withAuth from 'middlewares/withAuth';
import ReactPlayer from 'react-player';

import { FaPlay, FaPause } from 'react-icons/fa';
import {
  BiFullscreen,
  BiRectangle,
  BiCircle,
  BiEraser,
  BiUndo,
  BiRedo,
} from 'react-icons/bi';
import { MdTimer } from 'react-icons/md';
import { HiOutlineThumbUp } from 'react-icons/hi';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineMinus } from 'react-icons/ai';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { GiArrowCursor } from 'react-icons/gi';
import { BsBrush } from 'react-icons/bs';
import { RiBrushLine, RiDeleteBin2Line } from 'react-icons/ri';

import moment from 'moment';
import screenfull from 'screenfull';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { animateScroll as scroll } from 'react-scroll';
import ConfirmModal from 'components/dashboard/ConfirmModal';
import { unwrapResult } from '@reduxjs/toolkit';
import CircleCharIcon from 'components/dashboard/CircleCharIcon';
import AnnotationPane from 'components/dashboard/AnnotationPane';
import Button from 'components/elements/Button';
import { db } from 'config/firebase';

import { withTranslation } from 'react-i18next';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const createSchema = yup.object().shape({
  text: yup.string(),
});

const updateSchema = yup.object().shape({
  text: yup.string(),
});

const colors = [
  {
    className: 'bg-blue-500',
    color: '#3B82F6',
  },
  {
    className: 'bg-green-500',
    color: '#22C55E',
  },
  {
    className: 'bg-amber-500',
    color: '#F59E0B',
  },
  {
    className: 'bg-red-500',
    color: '#EF4444',
  },
];

const tools = [
  {
    name: 'pen',
    icon: <BsBrush />,
  },
  {
    name: 'arrow',
    icon: <GiArrowCursor className="transform rotate-45" />,
  },
  {
    name: 'rectangle',
    icon: <BiRectangle />,
  },
  {
    name: 'ellipse',
    icon: <BiCircle />,
  },
  {
    name: 'line',
    icon: <AiOutlineMinus className="transform rotate-45" />,
  },
];

const initialAnnotationParams = {
  tool: tools[0].name,
  color: colors[0].color,
};

const initialAnnotationData = {
  lines: [],
  arrows: [],
  rects: [],
  ellipses: [],
};

const Player: React.FC<any> = ({ t }) => {
  const router = useRouter();
  const mediaId = router.query.id;
  const dispatch: any = useDispatch();
  const media = useSelector((state: any) => state.player.data);
  const comments = useSelector((state: any) => state.comment.data);
  const deleting = useSelector((state: any) => state.comment.deleting);

  const videoRef = createRef<ReactPlayer | any>();
  const posbarRef = createRef<HTMLDivElement>();

  const [comment, setComment] = useState(null);

  const [playedTime, setPlayedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loadedTime, setLoadedTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [start, setStart] = useState(0);

  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentDeleting, setCommentDeleting] = useState(null);
  const [commentEditing, setCommentEditing] = useState(null);

  const [commentLineCount, setCommentLineCount] = useState(1);

  const [annotationParams, setAnnotationParams] = useState(
    initialAnnotationParams
  );

  const [annotation, setAnnotation] = useState(initialAnnotationData);
  const [annotationHistory, setAnnotationHistory] = useState([]);
  const [annotationStep, setAnnotationStep] = useState(-1);

  const [isCommenting, setIsCommenting] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);

  const [isTimeCoding, setIsTimeCoding] = useState(true);

  const {
    handleSubmit: handleCreateSubmit,
    control: controlCreate,
    reset: resetCreate,
  } = useForm();

  const {
    handleSubmit: handleUpdateSubmit,
    control: controlUpdate,
    reset: resetUpdate,
  } = useForm({
    resolver: yupResolver(updateSchema),
  });

  const onCreateSubmit = (data): void => {
    if (data.text !== '' || isAnnotated()) {
      dispatch(
        createComment({
          start: isTimeCoding ? start : null,
          end: isTimeCoding ? null : null,
          fileId: media.id,
          text: data.text,
          annotation: isAnnotating ? annotation : initialAnnotationData,
        })
      );
      resetCreate({ text: '' });
      resetAnnotating();
    }
  };

  const onUpdateSubmit = (data): void => {
    dispatch(updateComment({ id: commentEditing.id, data: data }));
    resetUpdate();
    setCommentEditing(null);
  };

  const changeTime = (seconds) => {
    videoRef.current.seekTo(seconds !== 0 ? seconds / 1000 : seconds);
    setStart(Math.round(seconds));
  };

  const handleShowComment = (comment) => {
    setComment(comment);
    setAnnotation(comment.annotation);
    setIsAnnotating(false);
    if (comment.start !== null) changeTime(comment.start);
  };

  const handleDeleteComment = () => {
    dispatch(deleteComment(commentDeleting.id));
    setShowDeleteCommentModal(false);
    if (comment && comment.id === commentDeleting.id) {
      resetAnnotating();
    }
  };

  const handlePlaying = (status) => {
    setPlaying(status);
    if (!status) setStart(playedTime);
  };

  const resetAnnotationData = () => {
    setAnnotationParams(initialAnnotationParams);
    setAnnotation(initialAnnotationData);
    setAnnotationHistory([]);
    setAnnotationStep(-1);
    setCommentLineCount(1);
  };

  const initAnnotating = () => {
    setComment(null);
    resetAnnotationData();
    setIsAnnotating(true);
  };

  const resetAnnotating = () => {
    resetAnnotationData();
    setIsAnnotating(false);
  };

  useEffect(() => {
    if (typeof mediaId !== 'undefined') dispatch(fetchMedia(mediaId));

    const unsubscribe = db
      .collection('comments')
      .where('fileId', '==', mediaId)
      .orderBy('createdAt')
      .onSnapshot((docs) => {
        const comments = [];

        docs.forEach((doc) => {
          comments.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        dispatch(setComments(comments));
      });

    return () => unsubscribe();
  }, [mediaId]);

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const handleUndo = () => {
    const step = annotationStep - 1;
    if (step < 0) {
      setAnnotation(initialAnnotationData);
      setAnnotationStep(-1);
      return;
    }
    setAnnotation(annotationHistory[step]);
    setAnnotationStep(step);
  };

  const handleRedo = () => {
    const step = annotationStep + 1;
    if (step > annotationHistory.length - 1) {
      return;
    }
    setAnnotation(annotationHistory[step]);
    setAnnotationStep(step);
  };

  const commentsPrev: any = usePrevious(comments);

  useEffect(() => {
    if (comments.length > commentsPrev?.length) {
      scroll.scrollToBottom({
        containerId: 'comment-pannel',
        duration: 500,
      });
    }
  }, [comments]);

  useEffect(() => {
    if (media?.assetType === 'image') {
      setIsTimeCoding(false);
    } else {
      setIsTimeCoding(true);
    }
  }, [media]);

  const isAnnotated = () =>
    annotation.lines.length ||
    annotation.arrows.length ||
    annotation.rects.length ||
    annotation.ellipses.length;

  const REACT_PLAYER = (
    <ReactPlayer
      ref={videoRef}
      url={media?.src}
      playing={playing}
      progressInterval={200}
      onProgress={({ playedSeconds, loadedSeconds }) => {
        setPlayedTime(Math.round(playedSeconds * 1000));
        setLoadedTime(Math.round(loadedSeconds * 1000));
      }}
      onDuration={(duration) => {
        setTotalTime(Math.round(duration * 1000));
      }}
      className="bg-black"
      width="100%"
      height="100%"
    />
  );

  const ANNOTATION_PANE = (
    <AnnotationPane
      params={annotationParams}
      data={annotation}
      WIDTH={media?.width}
      HEIGHT={media?.height}
      editable={isAnnotating}
      onChange={(value) => setAnnotation({ ...value })}
      onChangeStart={(value) => {
        setAnnotation({ ...value });
        if (annotationStep < annotationHistory.length - 1) {
          setAnnotationHistory([
            ...annotationHistory.slice(0, annotationStep + 1),
          ]);
        }
      }}
      onChangeEnd={() => {
        const step = annotationStep + 1;
        setAnnotationHistory([...annotationHistory, annotation]);
        setAnnotationStep(step);
      }}
    />
  );

  return (
    <Playerlayout>
      <main className="absolute top-0 pt-16 flex w-full h-screen mx-auto overflow-hidden outline-none">
        <div className="flex flex-col justify-between w-full p-3">
          <div
            className={`
              w-full m-auto overflow-hidden
              ${
                media?.assetType === 'video'
                  ? 'max-w-6xl'
                  : 'flex items-center justify-center h-full'
              }
            `}
          >
            <div className="relative">
              <div
                className={`
                  relative 
                  ${
                    media?.assetType === 'video'
                      ? 'aspect-w-16 aspect-h-9'
                      : 'children:overflow-unset'
                  }
                `}
              >
                {media?.assetType === 'video' && (
                  <>
                    {REACT_PLAYER}
                    {ANNOTATION_PANE}
                  </>
                )}
                {media?.assetType === 'image' && (
                  <TransformWrapper
                    pan={{
                      disabled: isAnnotating,
                    }}
                  >
                    <TransformComponent>
                      <img src={media?.src} />
                      {ANNOTATION_PANE}
                    </TransformComponent>
                  </TransformWrapper>
                )}
              </div>

              {media?.assetType === 'video' && (
                <>
                  <div
                    ref={posbarRef}
                    className="relative h-1.5 bg-gray-500 cursor-pointer"
                    onClick={(e) => {
                      changeTime(
                        totalTime *
                          (e.nativeEvent.offsetX /
                            posbarRef.current.clientWidth)
                      );
                      setAnnotation(initialAnnotationData);
                    }}
                  >
                    <div
                      className="absolute h-full bg-gray-400"
                      style={{
                        width: `${(loadedTime / totalTime) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute h-full bg-royal-blue-500"
                      style={{
                        width: `${(playedTime / totalTime) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="relative border border-gray-200 h-6 bg-white">
                    {comments.map((el, key) => (
                      <CircleCharIcon
                        key={key}
                        string={el.commenter.name}
                        className="absolute w-5 h-5 text-2xs border-2 border-white cursor-pointer"
                        style={{
                          left: `calc(${(el.start / totalTime) * 100}% - 10px)`,
                        }}
                        data-tip={'works?'}
                        onClick={() => handleShowComment(el)}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between p-3 bg-white border-r border-l border-b border-gray-200">
                    <div className="">
                      <span
                        className="text-gray-600 hover:text-royal-blue-500 cursor-pointer"
                        onClick={() => handlePlaying(!playing)}
                      >
                        {playing ? <FaPause size={18} /> : <FaPlay size={18} />}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-base text-gray-600">
                        {moment.utc(playedTime).format('mm:ss')}
                      </span>
                      <span className="text-base text-gray-400 mx-1">/</span>
                      <span className="text-base text-gray-400">
                        {moment.utc(totalTime).format('mm:ss')}
                      </span>
                    </div>
                    <div className="">
                      <span
                        className="text-gray-600 hover:text-royal-blue-500 cursor-pointer"
                        onClick={() => {
                          if (screenfull.isEnabled) {
                            screenfull.request(videoRef.current.wrapper);
                          }
                        }}
                      >
                        <BiFullscreen size={18} />
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="relative flex justify-center mt-4">
            <div className="w-full max-w-4xl rounded-md px-2 py-3 bg-white border border-gray-200">
              <form onSubmit={handleCreateSubmit(onCreateSubmit)}>
                <Controller
                  name="text"
                  control={controlCreate}
                  defaultValue=""
                  render={(props) => (
                    <textarea
                      className="w-full border-none text-gray-600 overflow-hidden"
                      value={props.value}
                      onChange={(e) => {
                        props.onChange(e);
                        setCommentLineCount(
                          e.target.value.split(/\r\n|\r|\n/).length
                        );
                      }}
                      placeholder={t('Leave your comment here')}
                      rows={commentLineCount}
                      onKeyPress={(
                        e: React.KeyboardEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateSubmit(onCreateSubmit)();
                        }
                      }}
                    />
                  )}
                />
                <div className="flex justify-between items-center mt-2">
                  <div>
                    {media?.assetType === 'video' && (
                      <div
                        className={`flex items-center text-base cursor-pointer ${
                          isTimeCoding ? 'text-blue-700' : 'text-gray-600'
                        }`}
                        onClick={() => setIsTimeCoding(!isTimeCoding)}
                      >
                        <MdTimer size={18} />
                        <span className="ml-1">
                          {moment.utc(start).format('mm:ss')}
                        </span>
                        <span className={`ml-1 w-4 h-4 rounded font-semibold`}>
                          {isTimeCoding && <ImCheckboxChecked />}
                          {!isTimeCoding && <ImCheckboxUnchecked />}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {isAnnotating && (
                        <>
                          <div
                            className={`
                              flex justify-center items-center w-7 h-7 mr-2
                              cursor-pointer rounded-full overflow-hidden border-2 border-transparent
                              hover:border-gray-600 text-gray-600
                            `}
                            onClick={() => handleUndo()}
                          >
                            <BiUndo />
                          </div>
                          <div
                            className={`
                              flex justify-center items-center w-7 h-7 mr-2
                              cursor-pointer rounded-full overflow-hidden border-2 border-transparent
                              hover:border-gray-600 text-gray-600
                            `}
                            onClick={() => handleRedo()}
                          >
                            <BiRedo />
                          </div>
                          {colors.map((el, key) => (
                            <div
                              key={key}
                              className={`
                                flex justify-center items-center w-7 h-7 mr-2
                                cursor-pointer rounded-full overflow-hidden
                                ${
                                  el.color !== annotationParams.color
                                    ? 'hover:bg-opacity-30'
                                    : ''
                                }
                                ${
                                  el.color === annotationParams.color
                                    ? 'bg-opacity-70'
                                    : 'bg-opacity-0'
                                }
                                ${el.className}
                              `}
                              onClick={() =>
                                setAnnotationParams({
                                  ...annotationParams,
                                  color: el.color,
                                })
                              }
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${el.className}`}
                              />
                            </div>
                          ))}
                          {tools.map((el, key) => (
                            <div
                              key={key}
                              className={`
                                flex justify-center items-center w-7 h-7 mr-2
                                cursor-pointer rounded-full overflow-hidden border-2 border-gray-300
                                ${
                                  el.name !== annotationParams.tool
                                    ? 'hover:border-gray-600 text-gray-600'
                                    : ''
                                }
                                ${
                                  el.name === annotationParams.tool
                                    ? 'bg-gray-600 border-gray-600 text-white'
                                    : ''
                                }
                              `}
                              onClick={() =>
                                setAnnotationParams({
                                  ...annotationParams,
                                  tool: el.name,
                                })
                              }
                            >
                              {el.icon}
                            </div>
                          ))}
                          <div
                            className={`
                              flex justify-center items-center w-7 h-7 mr-2
                              cursor-pointer rounded-full overflow-hidden border-2 border-gray-300
                              hover:border-gray-600 text-gray-600
                            `}
                            onClick={() => {
                              const step = annotationStep + 1;
                              if (step < annotationHistory.length) {
                                setAnnotationHistory([
                                  ...annotationHistory.slice(0, step),
                                  initialAnnotationData,
                                ]);
                              } else {
                                setAnnotationHistory([
                                  ...annotationHistory,
                                  initialAnnotationData,
                                ]);
                              }
                              setAnnotationStep(step);
                              setAnnotation(initialAnnotationData);
                            }}
                          >
                            <BiEraser />
                          </div>
                        </>
                      )}
                      <div
                        className={`
                          flex justify-center items-center w-7 h-7 mr-2
                          cursor-pointer rounded-full overflow-hidden border-2 border-gray-300
                          hover:border-gray-600 text-gray-600
                        `}
                        onClick={() => {
                          if (isAnnotating) {
                            resetAnnotating();
                          } else {
                            initAnnotating();
                          }
                        }}
                      >
                        {isAnnotating && <RiDeleteBin2Line />}
                        {!isAnnotating && <RiBrushLine />}
                      </div>
                    </div>
                    <Button className="py-1 px-2 ml-4" size="xs">
                      {t('Send')}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          id="comment-pannel"
          className="custom-scrollbar w-comment-bar h-full pb-32 bg-white border-l border-gray-200 overflow-y-auto"
        >
          {comments.map((el, key) => (
            <div
              key={key}
              className={`
                p-4 border-b border-gray-300 cursor-default transition-opacity hover-trigger
                ${comment?.id === el.id ? 'bg-gray-300' : ''}
                ${comment?.id !== el.id ? 'hover:bg-gray-200' : ''} 
              `}
              onClick={() => {
                handleShowComment(el);
              }}
            >
              <div className="flex items-center">
                <CircleCharIcon
                  key={key}
                  string={el.commenter.name}
                  className="w-7 h-7"
                  style={{
                    left: `${(el.start / totalTime) * 100}%`,
                  }}
                />
                <span className="ml-2 text-gray-700">{el.commenter.name}</span>
                <span className="text-sm text-gray-400 ml-1">
                  {moment.utc(el.createdAt).fromNow(true)}
                </span>
              </div>
              {commentEditing && commentEditing.id === el.id ? (
                <div className="mt-1">
                  <form onSubmit={handleUpdateSubmit(onUpdateSubmit)}>
                    <Controller
                      name="text"
                      control={controlUpdate}
                      defaultValue={el.text}
                      render={(props) => (
                        <textarea
                          className="w-full p-2 text-gray-600 overflow-hidden bg-none rounded-sm border border-royal-blue-700"
                          value={props.value}
                          onChange={(e) => {
                            props.onChange(e);
                          }}
                          onKeyPress={(
                            e: React.KeyboardEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleUpdateSubmit(onUpdateSubmit)();
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          rows={el.text.split(/\r\n|\r|\n/).length}
                        />
                      )}
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentEditing(null);
                        }}
                      >
                        {t('Cancel')}
                      </button>
                      <button
                        type="submit"
                        className="text-sm text-gray-700 ml-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateSubmit(onUpdateSubmit)();
                        }}
                      >
                        {t('Save')}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="flex mt-1">
                    {el.start !== null && (
                      <div className="text-base font-bold text-royal-blue-600 mr-2">
                        {moment.utc(el.start).format('mm:ss')}
                      </div>
                    )}
                    <div className="text-base text-gray-700 whitespace-pre">
                      {el.text}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 hover:text-royal-blue-500 cursor-pointer">
                        {t('Reply')}
                      </span>
                      <span className="text-gray-500 hover:text-royal-blue-500 ml-3 cursor-pointer">
                        <HiOutlineThumbUp size={16} />
                      </span>
                    </div>
                    <div className="flex items-center hover-target">
                      <span
                        className="text-gray-500 hover:text-royal-blue-500 ml-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentEditing(el);
                        }}
                      >
                        <AiOutlineEdit size={16} />
                      </span>
                      <span
                        className="text-gray-500 hover:text-royal-blue-500 ml-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentDeleting(el);
                          setShowDeleteCommentModal(true);
                        }}
                      >
                        <AiOutlineDelete size={16} />
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
      <ConfirmModal
        open={showDeleteCommentModal}
        closeModal={() => setShowDeleteCommentModal(false)}
        title={'Delete this comment?'}
        text={`Are you sure you want to delete this comment?`}
        confirmColor="red"
        confirmText="Delete"
        confirmAction={() => handleDeleteComment()}
      />
    </Playerlayout>
  );
};

export default withAuth(withTranslation()(Player));
