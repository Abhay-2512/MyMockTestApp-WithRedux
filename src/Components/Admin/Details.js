import React from 'react';
import { useParams,Link } from 'react-router-dom';
import { useSelector } from 'react-redux';





function Details() {
    const reduxState = useSelector(state => state.Examination);
    console.log('i am Details info');
    let VerifyUser = reduxState.VerifyUser;
    console.log(VerifyUser);
    const { id } = useParams();
    const num = id.substring(1);
    console.log(num);
    const Num = Number(num) - 1;
    const UserData = VerifyUser[Num];
    console.log(UserData);


    return (
        <div className="mx-auto w-100" >

            <h2 className="text-center my-5"><b>Examianation Name</b> :{UserData.Exam}</h2>
            <table className="table table-active w-75 mx-auto table-bordered table-hover table-striped">
                <tbody>
                    <tr>
                        <td><b>Candidate Name</b> :</td>
                        <td>{UserData.Username}</td>
                    </tr>
                    <tr>
                        <td><b>Candidate Email</b> :</td>
                        <td>{UserData.Email}</td>
                    </tr>
                    <tr>
                        <td><b>Candidate UserID</b> :</td>
                        <td>{UserData.UserID}</td>
                    </tr>
                    <tr>
                        <td><b>Candidate Password</b> :</td>
                        <td>{UserData.Password}</td>
                    </tr>
                    <tr>
                        <td><b>Candidate Gender</b> :</td>
                        <td>{UserData.gender}</td>
                    </tr>
                    <tr>
                        <td><b>Candidate Examination</b> :</td>
                        <td>{UserData.Exam}</td>
                    </tr>
                </tbody>
            </table>
            <div className="w-75 mx-auto">
                <Link to="/adminAccount"><button className="btn btn-success float-end my-2">Back</button></Link>
            </div>

        </div>
    )
}

export default Details
