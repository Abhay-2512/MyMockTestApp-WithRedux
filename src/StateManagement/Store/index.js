import {configureStore} from '@reduxjs/toolkit';
import ExaminationSlice from '../ReducersSlicees/ExaminationSlice';

const store=configureStore({
    reducer:{
        Examination:ExaminationSlice
    }
})

export default store;