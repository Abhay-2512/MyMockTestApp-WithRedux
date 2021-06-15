import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Asynchronous Actions

let URL = "http://localhost:3006/QuestionPaper";
let URL2 = "http://localhost:3006/CandidateRegInfo";
let URL3 = "http://localhost:3006/AdminRegInfo";
const loadMyAnswers = createAsyncThunk(
    'Examination/loadMyAnswers',
    async () => {
        const res = await axios.get(URL)
        return res.data;
    }
)
const loadCurrQueAnswer = createAsyncThunk(
    'Examination/loadCurrQueAnswer',
    async () => {
        const res = await axios.get(URL)
        const myArr = res.data;
        return myArr[0];
    }
)

const loadVerifyAdmin = createAsyncThunk(
    'Examination/loadVerifyAdmin',
    async () => {
        const res = await axios.get(URL3)
        return res.data;
    }
)

const loadVerifyUser = createAsyncThunk(
    'Examination/loadVerifyUser',
    async () => {
        const res = await axios.get(URL2)
        // console.log(res.data);
        return res.data;
    }
)

const generateCaptcha=createAsyncThunk(
    'Examination/reloadCaptcha',
    async()=>{
        let alphabets = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";

        // console.log(status)
        let first = alphabets[Math.floor(Math.random() * alphabets.length)];
        let second = Math.floor(Math.random() * 10);
        let third = Math.floor(Math.random() * 10);
        let fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
        let fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
        let sixth = Math.floor(Math.random() * 10);
        let captcha = first.toString().toUpperCase() + second.toString() + third.toString() + fourth.toString() + fifth.toString() + sixth.toString();
        // console.log(captcha);
        return await captcha;
    }
)





const ExaminationSlice = createSlice({
    name: 'Examination',
    initialState: {
        MyAnswers: [],
        CurrQueAnswer: {},
        VerifyAdmin: [],
        VerifyUser: [],
        Loader:false,
        VerifiedByAdmin:[],
        Capcha:""
    },
    reducers: {
        reloadMyAnswers:(state,action)=>{
            return {...state,MyAnswers:action.payload}
        },
        reloadCurrQueAnswer:(state,action)=>{
            return {...state,CurrQueAnswer:action.payload}
        },
        reloadVerifiedByAdmin:(state,action)=>{
            return {...state,VerifiedByAdmin:action.payload}

        }
    },
    extraReducers: {
        [loadMyAnswers.fulfilled]: (state, action) => {
            return {...state,MyAnswers:action.payload}
        },
        [loadCurrQueAnswer.fulfilled]: (state, action) => {
            return {...state,CurrQueAnswer:action.payload}
        },
        [loadVerifyAdmin.fulfilled]: (state, action) => {
            return {...state,VerifyAdmin:action.payload}
        },
        [loadVerifyUser.fulfilled]: (state, action) => {
            // console.log(action.payload);
            return {...state,VerifyUser:action.payload}
        },
        [loadMyAnswers.rejected]: (state, action) => {
            return {...state,MyAnswers:[]}
        },
        [loadCurrQueAnswer.rejected]: (state, action) => {
            return {...state,CurrQueAnswer:{}}
        },
        [loadVerifyAdmin.rejected]: (state, action) => {
            return {...state,VerifyAdmin:[]}
        },
        [loadVerifyUser.rejected]: (state, action) => {
            return {...state,VerifyUser:[]}
        },
        [loadMyAnswers.pending]: (state, action) => {
            return {...state,Loader:true}
        },
        [loadCurrQueAnswer.pending]: (state, action) => {
            return {...state,Loader:true}
        },
        [loadVerifyAdmin.pending]: (state, action) => {
            return {...state,Loader:true}
        },
        [loadVerifyUser.pending]: (state, action) => {
            return {...state,Loader:true}
        },
        [generateCaptcha.fulfilled]: (state, action) => {
            return {...state,Capcha:action.payload}
        }
    }
})


export const {reloadCurrQueAnswer,reloadMyAnswers,reloadVerifiedByAdmin}=ExaminationSlice.actions;
export {loadMyAnswers,loadCurrQueAnswer,loadVerifyAdmin,loadVerifyUser,generateCaptcha}
export default ExaminationSlice.reducer;