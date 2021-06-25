import React from 'react';
// import AppContext from '../../AppContext';
import {Link} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {reloadVerifiedByAdmin} from '../../StateManagement/ReducersSlicees/ExaminationSlice';
import axios from 'axios';
import {toast } from 'react-toastify';
import {useHistory} from 'react-router-dom';



let URL2 = "http://localhost:3006/CandidateRegInfo";


function AdminAccount() {
    const history=useHistory()
    console.log('i am AdminAccount');
    const reduxState = useSelector(state => state.Examination)
    const dispatch = useDispatch()

    // const MyAcContext = useContext(AppContext);
// const {verifyByAdmin} = MyAcContext.handler;
// const {state} = MyAcContext.state;
let VerifyUser=reduxState.VerifyUser;
// let VerifyUser=reduxState.VerifyUser;

// showCandidateDetails

const showCandidateDetails=(e)=>{
 let userId=e.target.id;

  history.push(`/user/:${userId}`)
}

 //Admin Varification 

 const verifyByAdmin = (e) => {

    //Selected Candidate ID
    let myUserId = e.target.id;
    // console.log(myUserId);
    let myCandidate;

    // collect Candidate Data from Server
    axios.get(`${URL2}/${myUserId}`).then((res) => {
      myCandidate = res.data;

      //Changing Status true or false  
      let newStatus = (myCandidate.Status === true) ? false : true;
      // console.log(res.data);

      // Update that changes Status On Server  
      axios.put(`${URL2}/${myUserId}`, { ...myCandidate, Status: newStatus })
        .then((respo) => {
          dispatch(reloadVerifiedByAdmin(respo.data))
        }).catch((error) => console.log(error));
    }).catch((err) => {
      toast.error(err, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // console.log(err)
    });
    // console.log(myCandidate);
  }


    return (
        <div className="w-100 d-flex flex-column">
        <h2 className="text-center fs-1 my-5">WelCome To Admin Account</h2>
        <div className="w-75 mx-auto ">
           <Link to="/examPaper" className="btn btn-success float-start mb-1">Set Question Paper</Link>
        </div>
        <table className="table table-hover table-bordered table-active table-striped w-75 mx-auto " >
            <thead>
                <tr>
                    <th>SR</th>
                    <th>USERNAME</th>
                    <th>USER ID</th>
                    <th>PASSWORD</th>
                    <th>CANDIDATE INFO</th>
                    <th>VERIFICATION</th>
                </tr>
            </thead>
            <tbody>
            {VerifyUser.map((user,ind)=>{

             return(
                 <tr key={ind}>
                    <td>{user.id}</td>
                    <td>{user.Username}</td>
                    <td>{user.UserID}</td>
                    <td>{user.Password}</td>
                    <td className="text-center"><button className="btn btn-primary " type="button" id={user.id} onClick={showCandidateDetails}>FORM</button></td>
                    <td className="text-center"><button type="button" id={user.id} className={(user.Status===true)?"btn btn-success":"btn btn-danger"} onClick={verifyByAdmin} >{(user.Status===false)?('Verify'):('Verified')}</button></td>
                </tr>);
            })}

            </tbody>
        </table>
        <div className="w-75 mx-auto">
            <Link to="/admin"><button className="btn btn-success float-end my-2">Back</button></Link>
        </div>
            
        </div>
    )
}

export default AdminAccount
