import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navigation from './components/Navigation';
import Currency from './components/Currency'
import { FiRepeat } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { getCurrencies, getRate } from './features/currencySlice';
import { useEffect } from 'react';
import { Container } from 'reactstrap';
function App() {
    const dispatch = useDispatch();
    const { convertFrom, convertTo } = useSelector((store) => store.currency);

    useEffect(() => {
        dispatch(getCurrencies()); 
    }, [dispatch]);

    useEffect(() => {
        dispatch(getRate());
    }, [dispatch, convertFrom, convertTo]);

    return (
        <>
            <Navigation />
            <Container className='text-center mt-5'>
                <Currency input='convertFrom'/>
                <FiRepeat />
                <Currency input='convertTo'/>
            </Container> 
        </>
    );
}

export default App;
