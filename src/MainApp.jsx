import React, { useEffect, useReducer, useRef,useState } from 'react'
import AppContext from './AppContext';
import Questions from './Components/ExaminationModule/Questions';
import Register1 from './Components/RegistrationModule/Register1';
import LogInCandidate from './Components/RegistrationModule/LogInCandidate';
import axios from 'axios';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import MyResult from './Components/ResultModule/MyResult';
import ErrorBoundary from './Components/ErrorBoundary';
import AdminAccount from './Components/Admin/AdminAccount';
import VerifiedList from './Components/Admin/VerifiedList';
import ExamPaper from './Components/Admin/ExamPaper';
import { Switch, Redirect, Route, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CandidatesResult from './Components/ResultModule/CandidatesResult';
import { useSelector, useDispatch } from 'react-redux';
import store from '../src/StateManagement/Store/index';
import Details from '../src/Components/Admin/Details';
import { loadMyAnswers, loadCurrQueAnswer, loadVerifyAdmin, loadVerifyUser, reloadMyAnswers, generateCaptcha } from '../src/StateManagement/ReducersSlicees/ExaminationSlice';



// let URL = "http://localhost:3006/QuestionPaper";
// let URL2 = "http://localhost:3006/CandidateRegInfo";
// let URL3 = "http://localhost:3006/AdminRegInfo";
let URL4 = "http://localhost:3006/CandidateExamDetails";

const initialState = {
  UserCheck: {
    UserID: "",
    Password: "",
    CapchaEntered: "",
    UserCheckError: false
  },
  ExamTime: 0
}

const myReducer = (state, action) => {
  switch (action.type) {
    case 'UserCheck': return { ...state, UserCheck: action.payload };
    case 'ExamTime': return { ...state, ExamTime: action.payload };
    case 'UserCheckError': return { ...state, UserCheck: action.payload };
    default: return state;
  }
}



function App() {
  const reduxState = useSelector(state => state.Examination)
  const VerifiedByAdmin = useSelector(state => state.Examination.VerifiedByAdmin)
  const dispatch = useDispatch()
  const [state, dispatcher] = useReducer(myReducer, initialState);
  const [CurrQueAnswer, setCurrQueAnswer] = useState(reduxState.CurrQueAnswer);
  
  // let location=useLocation();
  let history = useHistory();
  
  
  
  // LOad All Questions into state array of object when component mount first[]
  useEffect(() => {
    console.log("i am loading useEffect1");
    store.dispatch(loadMyAnswers())
    store.dispatch(loadCurrQueAnswer())
    store.dispatch(loadVerifyAdmin())
    store.dispatch(generateCaptcha())
    
  }, []);
  
  // console.log(CurrQueAnswer);



  // Load the candidate registerd INformation into State To verify Registered Candidate

  // LOad The Every time whenever Candidate Registered [RegData]

  useEffect(() => {
    console.log("i am loading useEffect1");

    store.dispatch(loadVerifyUser())

  }, [VerifiedByAdmin])


  // console.log(alphabets.length);

  const generate = () => {

    dispatch(generateCaptcha())

  }

  // load state onchanging userinput

  const UsercheckUserData = (e) => {
    dispatcher({ type: 'UserCheck', payload: { ...state.UserCheck, [e.target.name]: e.target.value } })
  }

  // chacking Registered user data  is Fair Or Not


  const endExam = useRef();
  const UserVerification = (e) => {
    e.preventDefault();
    let ExamStartTime = 0;
    if (reduxState.Capcha.trim() === state.UserCheck.CapchaEntered.trim()) {
      reduxState.VerifyUser.map((item) => {
        if ((item.UserID === state.UserCheck.UserID) && (item.Password === state.UserCheck.Password) && (item.Status === true)) {

          setCurrQueAnswer(reduxState.CurrQueAnswer)
          // Set the Examination Time After Candidate Get SuccessFully LogIn 
          ExamStartTime = 5000;

          // Set Duration Of Examination/QuestionPaper Time 
          let ExamTotalTime = (1000 * 60);

          //Total time to Complete Examination After Candidate LogIn
          let ExamEndTime = ExamTotalTime + ExamStartTime;

          //Examination Alert 
          toast.success(`hello candidate Exam Will Start within ${ExamStartTime / 1000} Seconds !`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          dispatcher({ type: 'USerCheck', payload: { ...state.UserCheck, UserID: "", Password: "" } })
          // console.log(state.UserCheck);

          // Examination Start after ExamStartTime

          setTimeout(() => {
            let CurrentTime = new Date().getTime();

            history.push("/questions");
            endExam.current = setInterval(() => {
              let ExamCounter = (Number(new Date().setTime(CurrentTime + ExamTotalTime)) - Number(new Date().getTime()));
              dispatcher({ type: 'ExamTime', payload: ExamCounter })
              // console.log(ExamCounter);
            }, 1000)
          }, ExamStartTime);

          //Examination will End After ExamEndTime

          setTimeout(() => {
            axios.post(URL4, { id: "", CandidateName: state.UserCheck.UserID, CandidatePassword: state.UserCheck.Password, CandidateAnswerKey: store.getState().Examination.MyAnswers })
              .then((resp) => {
                console.log(resp.statusText);
              }).catch((err) => console.log(err));
            history.push("/myResult");
            clearInterval(endExam.current);

          }, ExamEndTime)

          // Clear The Input Fields After Verified

          dispatcher({ type: 'UserCheck', payload: { ...state.UserCheck, UserID: "", Password: "" } })

        }
        if (ExamStartTime === 0) {
          dispatcher({ type: 'UserCheckError', payload: { ...state.UserCheck, UserCheckError: true } })
        }

        return ExamStartTime;

      })
    } else {
      console.log(reduxState.Capcha.trim());
      console.log(state.UserCheck.CapchaEntered.trim());
      toast.info("Dear, Candidate Please Enter Valid Capcha...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    }
  }

  //Input FocusInput and  blurInput Eventhandler

  const handleFocusInput = (e) => {
    dispatcher({ type: 'UserCheckError', payload: { ...state.UserCheck, UserCheckError: false } })

  }
  const handleBlurInput = (e) => {
    if (state.UserCheck.UserID === "" || state.UserCheck.Password === "") {
      dispatcher({ type: 'UserCheckError', payload: { ...state.UserCheck, UserCheckError: true } })

    }
  }


  
  const AdminVerification = (e) => {

    e.preventDefault();
    if (reduxState.Capcha === state.UserCheck.CapchaEntered) {
      let present=0;
      reduxState.VerifyAdmin.map((item) => {
        if ((item.UserID === state.UserCheck.UserID) && (item.Password === state.UserCheck.Password)) {

          dispatcher({ type: 'UserCheck', payload: { ...state.UserCheck, UserID: "", Password: "" } })
          present=1;
          history.push("/adminAccount")
        }
        return null
      })
      if (present===0) {
        toast.warn(' Please Enter Valid Information !', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.info("Dear, Candidate  Enter Valid Capcha...Don't Copied Type Text", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    }
  }


  // Load State answer Give by Candidate

  const handleChangeInput = (e) => {
    console.log(e.target.value);
    console.log(e.target.title);
    
    setCurrQueAnswer({ ...CurrQueAnswer, Option: e.target.value, OptionText: e.target.title })
    // dispatch(loadCurrQueAnswer({ ...reduxState.CurrQueAnswer, Option: e.target.value, OptionText: e.target.title }))
    // dispatcher({ type: 'CurrQueAnswer', payload: { ...reduxState.CurrQueAnswer, Option: e.target.value, OptionText: e.target.title } })
  }

  // Loadind Next Question by pressing Next Button

  const handleNextQuestion = (e) => {
    e.preventDefault();
    reduxState.MyAnswers.map((question, INDEX) => {
      if (question.Question === CurrQueAnswer.Question) {
        let myCopiedArr = [...reduxState.MyAnswers];
        console.log(CurrQueAnswer.Option);
        console.log(CurrQueAnswer.OptionText);
        myCopiedArr.splice(INDEX, 1, { ...question, Option: CurrQueAnswer.Option, OptionText: CurrQueAnswer.OptionText })


        // dispatcher({ type: 'MyAnswers', payload: reduxState.MyAnswers })
        console.log(myCopiedArr);
        dispatch(reloadMyAnswers(myCopiedArr))




        if (INDEX < reduxState.MyAnswers.length - 1) {
          reduxState.MyAnswers.map((que, IND) => {
            if (que.Question === CurrQueAnswer.Question) {
              // dispatch(reloadCurrQueAnswer(reduxState.MyAnswers[IND + 1]))
              setCurrQueAnswer(reduxState.MyAnswers[IND + 1])


              // dispatcher({ type: 'CurrQueAnswer', payload: reduxState.MyAnswers[IND + 1] })
            }
            return null;
          });
        } else {

          if (window.confirm("Do You Want To End Examination")) {
            history.push("/myResult");
            clearInterval(endExam.current);

          }
        }



      }
      return INDEX;
    });
  }

  // Button For Clear Options

  const handleClearOptions = (e) => {
    e.preventDefault();
    reduxState.MyAnswers.map((question, INDEX) => {
      if (question.Question === CurrQueAnswer.Question) {
        let myCopiedArr = [...reduxState.MyAnswers];
        myCopiedArr.splice(INDEX, 1, { ...question, Option: "", OptionText: "" })
        // dispatcher({ type: 'MyAnswers', payload: reduxState.MyAnswers })
        dispatch(reloadMyAnswers(myCopiedArr));
        // setCurrentQue(reduxState.CurrQueAnswer)

        if (reduxState.MyAnswers.length > INDEX + 1) {

          // dispatcher({ type: 'CurrQueAnswer', payload: reduxState.MyAnswers[INDEX + 1] })
          // dispatch(reloadCurrQueAnswer(reduxState.MyAnswers[INDEX + 1]))
          setCurrQueAnswer(reduxState.MyAnswers[INDEX + 1])


        }


      }
      return INDEX;
    });
  }



  // Loadind Prevous Question by pressing Previos Button


  const handlePrevQuestion = (e) => {
    e.preventDefault();

    if (reduxState.MyAnswers.length > 1) {
      reduxState.MyAnswers.map((que, ind) => {
        if (que.Question === CurrQueAnswer.Question) {
          console.log(que);
          // dispatch(reloadCurrQueAnswer(reduxState.MyAnswers[ind - 1]))
          setCurrQueAnswer(reduxState.MyAnswers[ind - 1])


          // dispatcher({ type: 'CurrQueAnswer', payload: reduxState.MyAnswers[ind - 1] })

        }
        return null;
      });

    } else {
      alert("No Question");
      dispatcher({ type: 'CurrQueAnswer', payload: reduxState.MyAnswers[0] })
      // dispatch(reloadCurrQueAnswer(reduxState.MyAnswers[0]))
      setCurrQueAnswer(reduxState.MyAnswers[0])

    }
  }

  const selectQueByPanel = (e) => {
    let QueInd = Number(e.target.value) - 1;
    // dispatch(reloadCurrQueAnswer(reduxState.MyAnswers[Number(QueInd)]))
    setCurrQueAnswer(reduxState.MyAnswers[Number(QueInd)])

    // dispatcher({ type: 'CurrQueAnswer', payload: reduxState.MyAnswers[Number(QueInd)] })

  }


  return (
    <div>
      <ToastContainer />
      {/* <div className="ExamName bg-aqua w-100 text-center p-2 ">SCC EXAM</div> */}
      <AppContext.Provider value={{
        state: { reduxState: reduxState, state: state, endExam: endExam, CurrQueAnswer:CurrQueAnswer },
        handler: {
          handleChangeInput: handleChangeInput,
          handleNextQuestion: handleNextQuestion,
          handlePrevQuestion: handlePrevQuestion,
          UsercheckUserData: UsercheckUserData,
          UserVerification: UserVerification,
          AdminVerification: AdminVerification,
          generate: generate,
          selectQueByPanel: selectQueByPanel,
          handleClearOptions: handleClearOptions
        }
      }
      }>

        <Switch>
          <ErrorBoundary>
            <Route exact path="/home" component={Register1} />

            <Route exact path="/register" component={Register1} />

            <Route exact path="/logInCandidate" render={() => <LogInCandidate myHandlerAdmin={UserVerification} myHandlerUsercheck={UsercheckUserData} myHanderCapcha={generate} handleFocusInput={handleFocusInput} handleBlurInput={handleBlurInput} myState={state} text="Candidate" />} />

            <Route exact path="/candidatesResult" component={CandidatesResult} />

            <Route exact path="/myResult" component={MyResult} />

            <Route exact path="/user/:id" component={Details} />

            <Route exact path="/admin" render={() => <LogInCandidate myHandlerAdmin={AdminVerification} myHandlerUsercheck={UsercheckUserData} myHanderCapcha={generate} myState={state} handleFocusInput={handleFocusInput} handleBlurInput={handleBlurInput} text="Admin" />} />

            <Route exact path="/adminAccount" component={AdminAccount} />

            <Route exact path="/verifiedList" component={VerifiedList} />

            <Route exact path="/examPaper" component={ExamPaper} />

            <Route exact path="/questions" component={Questions} />

            <Redirect to="/home" />
          </ErrorBoundary>
        </Switch>


      </AppContext.Provider>

    </div>
  );
}

export default App;
