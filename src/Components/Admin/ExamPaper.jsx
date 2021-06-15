import React, { useRef } from 'react';
import axios from 'axios';
// import AppContext from '../../AppContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Question from '../ExaminationModule/Question';
// import userEvent from '@testing-library/user-event';


let URL = "http://localhost:3006/QuestionPaper";


function ExamPaper() {
    let Question,CureAnswer,Answers1,Answers2,Answers3,Answers4,Answers5,id;
    // const [ExamQuestion, setExamQuestion] = useState(
    //     {
    //         id: 1,
    //         CureAnswer: "",
    //         Question: "",
    //         Answers: []
    //     }
    // )
    

    // const examQuetionInputHandle = (e) => {
    //     let name = e.target.name;
    //     if(name==="Answers1"){
    //         setExamQuestion({ ...ExamQuestion, Answers:ExamQuestion.Answers[0]=e.target.value});
    //     }
    //     if(name==="Answers2"){
    //         setExamQuestion({ ...ExamQuestion, Answers:ExamQuestion.Answers[1]=e.target.value});
    //     }
    //     if(name==="Answers3"){
    //         setExamQuestion({ ...ExamQuestion, Answers:ExamQuestion.Answers[2]=e.target.value});
    //     }
    //     if(name==="Answers4"){
    //         setExamQuestion({ ...ExamQuestion, Answers:ExamQuestion.Answers[3]=e.target.value});
    //     }
    //     if(name==="Answers5"){
    //         setExamQuestion({ ...ExamQuestion, Answers:ExamQuestion.Answers[4]=e.target.value});
    //     }
    //     if(name==="id"||name==="CureAnswer"||name==="Question"){
    //         let val = e.target.value;
    //         setExamQuestion({ ...ExamQuestion, [name]: val });

    //     }

    // }
    const addingExamQuestion = (e) => {
        e.preventDefault();
        if (id.current.value && Answers1.current.value &&Answers2.current.value && Answers3.current.value && Answers4.current.value && Answers5.current.value && CureAnswer.current.value && Question.current.value) {

            let QuestionLoad = {
                        id:id.current.value ,
                        CureAnswer: CureAnswer.current.value,
                        Question: Question.current.value,
                        Answers: [Answers1.current.value,Answers2.current.value,Answers2.current.value,Answers4.current.value,Answers5.current.value]
                    }
            // console.log(QuestionLoad);
            axios.post(URL, QuestionLoad).then((res) => {
                // console.log(res.data);
                id.current.value=""
                CureAnswer.current.value=""
                Question.current.value=""
                Answers1.current.value=""
                Answers2.current.value=""
                Answers3.current.value=""
                Answers4.current.value=""
                Answers5.current.value=""

            }).catch((err) => console.log(err));


        } else {
            toast.info("Plaese Fill All Input Fields", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // alert("Plaese Fill All Input Fields");
        }

    }


    return (
        <div className="w-100">
            <div className="ms-5 my-3 mx-auto">
                <Link to="/register"><button className="btn btn-success my-2" >Back To Home page</button></Link>
            </div>
            <form className="mx-auto border border-1 p-3" style={{ width: "90%" }} onSubmit={addingExamQuestion}>
                <div className="d-flex flex-row justify-content-start my-5">
                    <input type="text" name="id" ref={id=useRef()} className="form-control" style={{ width: "40px" }}  /><input type="text" ref={Question=useRef()} name="Question" className="form-control"  />
                </div>
                <h2>Options</h2>
                <div className="d-flex flex-column">
                    <input type="text" name="Answers1" className="form-control my-1 w-50"  ref={Answers1=useRef()} placeholder="option1" ></input>
                    <input type="text" name="Answers2" className="form-control my-1 w-50"  ref={Answers2=useRef()} placeholder="option2" ></input>
                    <input type="text" name="Answers3" className="form-control my-1 w-50"  ref={Answers3=useRef()} placeholder="option3" ></input>
                    <input type="text" name="Answers4" className="form-control my-1 w-50"  ref={Answers4=useRef()} placeholder="option4" ></input>
                    <input type="text" name="Answers4" className="form-control my-1 w-50"  ref={Answers5=useRef()} placeholder="option5" ></input>
                </div>
                <div className="d-flex justify-content-center">
                    <input type="text" className="form-control w-auto my-3" ref={CureAnswer=useRef()} name="CureAnswer" placeholder="Correct Answer" ></input>
                </div>
                <div className="d-flex justify-content-center">
                    <input type="submit" className="form-control w-auto my-3 btn btn-success" value="Submit Question" placeholder="Correct Answer"></input>
                </div>

            </form>

        </div>
    )
}

export default ExamPaper
