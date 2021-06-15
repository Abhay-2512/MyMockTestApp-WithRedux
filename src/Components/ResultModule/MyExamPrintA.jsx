import React, { useState } from 'react'
// import AppContext from '../AppContext';
import domToPdf from 'dom-to-pdf';
import { Link } from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';
function MyExamPrint({ values }) {
    const [showResult, setshowResult] = useState(false)

    const myref = React.createRef();
    let MyAnswers = values.CandidateAnswerKey;
    

    let Answered = MyAnswers.filter((ele) => {
        return ele.OptionText !== undefined;
    });

    let counter = 0;
    MyAnswers.map((ele) => {
        if (ele.OptionText === ele.CureAnswer) {
            counter++;
            return counter;
        }
        return counter;
    })
    let myScore = (counter - ((Answered.length - counter) / 3)).toFixed(2);

    const genertePdf = () => {

        const element = document.getElementById("demo");
        const Options = { filename: 'abhaybokade.pdf' }
        domToPdf(element, Options, () => {
            return alert("hi");
        })
    }

    const generteResult = () => {
        setshowResult(true)
    }

    return (
    (showResult) ? (
        <div className="w-100 my-5">
            
            <table className="table table-bordered table-hover table-primary table-striped w-75 mx-auto">
                <tbody>
                    <tr>
                        <td><b>Total Question Attemptted</b></td>
                        <td>{MyAnswers.length}</td>
                    </tr>
                    <tr>
                        <td><b>Total Questions Answered</b></td>
                        <td>{Answered.length}</td>
                    </tr>
                    <tr>
                        <td><b>Total Questions Correct</b></td>
                        <td>{counter}</td>
                    </tr>
                </tbody>
            </table>              
            
            <div className="d-flex flex-wrap justify-content-evenly h-auto w-75 mx-auto my-3">
                <div className="text-center my-5 mx-1">
                    <div className="myRound">{` ${Answered.length}/${MyAnswers.length}`}</div>
                    <h2>Attempted</h2>
                </div>
                <div className="text-center my-5 mx-1">
                    <div className="myRound">{((myScore / (MyAnswers.length)) * 100).toFixed(1)}</div>
                    <h2>Percentile</h2>
                </div>
                <div className="text-center my-5 mx-1">
                    <div className="myRound">{((myScore / (Answered.length)) * 100).toFixed(1)}</div>
                    <h2>Accuracy</h2>
                </div>
                <div className="text-center my-5 mx-1">
                    <div className="myRound">{myScore}</div>
                    <h2>Score</h2>
                </div>
            </div>
            <div className="text-center d-flex justify-content-center">
            <Link to="/register" className="float-end"><button className="btn btn-success btn-sm my-2" title="Go to Home Page" >Home Page</button></Link>
            </div>

        </div>)
        : (
            <div>
                <ScrollToTop smooth={true} top={100} style={{ backgroundColor: "blue", fontWeight: "bold", borderRadius: "50%" }} color="white" />

                <div ref={myref} id="demo">
                    <div className="d-flex justify-content-between my-4">
                        <h3 className="p-1 ">{`Candidate ID :  ${values.CandidateName}`}</h3>
                        <p className="p-1 ">{new Date().toLocaleTimeString()}</p>
                    </div>

                    {MyAnswers.map((Que, ind) => {
                        return (
                            <div key={ind}>
                                <div className="d-flex justify-content-sm-between fs-5">
                                    <div className="p-1 fs-6"><b>{`Que No : (${Que.id} of ${MyAnswers.length})`}</b></div>
                                </div>
                                <div className="d-flex p-3 my-1 bg-success text-white fs-4">{` Que ${Que.id} :  ${Que.Question}`}
                                </div>

                                <div>
                                    {Que.Answers.map((item, ind) => {
                                        return (
                                            <div className="d-flex ms-3 fs-6" key={ind + 1}>
                                                <input className="form-check-input" type="radio" name="option" />
                                                <span className="mx-2">{ind + 1}</span>
                                                <span className="mx-2">{item}</span>
                                            </div>);
                                    })}
                                    {(Que.Option === undefined) ?
                                        (
                                        <div> 
                                            <div className="ms-3 d-flex text-primary fs-6">
                                            <span className="mx-2">Candidate Answer :</span>
                                            <span className="mx-2">{`Option : Not Answered `}</span>
                                        </div>    
                                        <div className="text-success ms-3">
                                            <span className="mx-2">Correct Answer :</span>
                                            <span className="mx-2">{`=> ${Que.CureAnswer}`}</span>
                                        </div>    
                                        </div>) :
                                        (<div>
                                        <div className="ms-3 d-flex text-primary fs-6">
                                            <span className="mx-2">Candidate Answer :</span>
                                            <span className="mx-2">{`Option : ${Que.Option}  => ${Que.OptionText}`}</span>
                                        </div>
                                        <div className="text-success ms-3">
                                            <span className="mx-2">Correct Answer :</span>
                                            <span className="mx-2">{` => ${Que.CureAnswer}`}</span>
                                        </div>
                                        </div>)}
                                    {/* <div className="d-grid gap-3 d-md-flex ms-2 my-3">
                                    <button className="btn btn-success" type="button">Save and Next Question</button>
                                    <button className="btn btn-success" type="button">Previous Question</button>
                                </div> */}
                                </div>
                            </div>
                        )
                    })}
                    <div className="d-flex justify-content-evenly my-3 ">
                        <button className="btn btn-success btn-sm my-2" onClick={genertePdf} >Download</button>
                        <button className="btn btn-success btn-sm my-2" onClick={generteResult} >See Result Analysis</button>
                        <Link to="/register" className="float-end"><button className="btn btn-success btn-sm my-2"  >Home Page</button></Link>
                    </div>
                </div>
            </div>)
    )
}

export default MyExamPrint;

