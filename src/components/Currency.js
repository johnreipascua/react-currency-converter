import React from 'react';
import { Container, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { changeAmount, changeCurrency } from '../features/currencySlice'


export default function Currency(props) {
    const dispatch = useDispatch();
    const { input } = props;
    const { 
        currencies, 
        convertFrom, 
        convertTo,
        fromNum, 
        toNum,
    } = useSelector((store) => store.currency);
    const selectedCurrency = input === 'convertFrom' ? convertFrom : convertTo
    const num = input === 'convertFrom' ? fromNum : toNum
    return (
        <Container className='d-flex mb-3 mt-3 gap-3'>
            <Input
                type='number'
                bsSize='lg'
                value={num}
                onChange={e => {
                    const payload = {
                        input,
                        val: e.target.value
                    }
                    dispatch(changeAmount(payload));
                }}
            />
            <Input
                type="select"
                value={selectedCurrency} 
                onChange={e => {
                    const payload = {
                        input,
                        val: e.target.value
                    }
                    dispatch(changeCurrency(payload));
                }}
            >
                {currencies.map(currency => (
                    <option key={currency[0]} value={currency[0]}>{currency[1]}</option>
                ))}
            </Input>
        </Container>
    )
}
