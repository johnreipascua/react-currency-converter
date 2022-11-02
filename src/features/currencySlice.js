import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const BASE_URL = 'https://v6.exchangerate-api.com/v6'
const API_KEY = process.env.REACT_APP_API_KEY;

const initialState = {
    currencies: [],
    convertFrom: '',
    convertTo: '',
    convertionRate: 1,
    amount: 1,
    convertInFrom: true,
    fromNum: 0,
    toNum: 0
}

export const getCurrencies = createAsyncThunk(
    'currency/getCurrencies',
    async () => {
        const res = await axios.get(`${BASE_URL}/${API_KEY}/codes`);
        return res.data.supported_codes;
    }
);

export const getRate = createAsyncThunk(
    'currency/getRate',
    async (e, thunkAPI) => {
        const state = thunkAPI.getState().currency;
        const { convertFrom, convertTo } = state;
        if (convertFrom !== '' && convertTo !== '') {
            const res = await axios.get(`${BASE_URL}/${API_KEY}/pair/${convertFrom}/${convertTo}/`);
            return res.data.conversion_rate;
        }
    }
);

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        changeAmount: (state, action) => {
            if (action.payload.input === 'convertFrom') {
                state.convertInFrom = true;
            } else if (action.payload.input === 'convertTo') {
                state.convertInFrom = false;
            }

            state.amount = action.payload.val;
            if (state.convertInFrom) {
                state.fromNum = state.amount;
                state.toNum = (state.amount * state.convertionRate).toFixed(2);
            } else {
                state.toNum = state.amount;
                state.fromNum = (state.amount / state.convertionRate).toFixed(2);
            }
        },
        changeCurrency: (state, action) => {
            if (action.payload.input === 'convertFrom') {
                state.convertFrom = action.payload.val;
            } else if (action.payload.input === 'convertTo') {
                state.convertTo = action.payload.val;
            }
        }
    },
    extraReducers: {
        [getCurrencies.fulfilled]: (state, action) => {
            state.currencies = action.payload;
            state.convertFrom = action.payload[146][0]; // USD
            state.convertTo = action.payload[110][0]; // PHP
        },
        [getRate.fulfilled]: (state, action) => {
            state.convertionRate = action.payload;
            if (typeof state.convertionRate !== 'undefined') {
                if (state.convertInFrom) {
                    state.fromNum = state.amount;
                    state.toNum = (state.amount * state.convertionRate).toFixed(2);
                } else {
                    state.toNum = state.amount;
                    state.fromNum = (state.amount / state.convertionRate).toFixed(2);
                }
            }
        }
    }
});

export const { changeAmount, changeCurrency } = currencySlice.actions;

export default currencySlice.reducer;