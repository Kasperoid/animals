import React, {FC, useEffect} from "react";
import {Statuses} from "../enums";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {
    asyncAnimals,
    asyncNextAnimals,
    changeByPage, changeInput,
    changeNumberPage, changeSelectSearch,
} from "../redux/animalsSlice";
const AnimalsForm:FC = () => {

    const animals = useAppSelector(state => state.animals.animals) // Все животные, которые пришли с сервера
    const nextAnimals = useAppSelector(state => state.animals.nextAnimals) // Животные, которые могут быть на следующей странице (возможно) - нужно для блокировки кнопки вперед
    const byPage = useAppSelector(state => state.animals.byPage) // Лимит
    const status = useAppSelector(state => state.animals.status) // Отслеживание статуса запроса
    const pageNumber = useAppSelector(state => state.animals.pageNumber) // Номер страницы
    const inputSearch = useAppSelector(state => state.animals.inputSearch) // Ввод, работает как буфер перед отправкой в запрос
    const selectSearch = useAppSelector(state => state.animals.selectedSearch) // Ввод, работает как хранилище для последнего ввода
    const errorMessage = useAppSelector(state => state.animals.errorMessage) // Сообщение ошибки

    const dispatcher = useAppDispatch()

    useEffect(() => {
        dispatcher(asyncAnimals({...selectSearch, limit: byPage, offset: (pageNumber - 1) * byPage}))
        dispatcher(asyncNextAnimals({...selectSearch, limit: byPage, offset: (pageNumber) * byPage}))
    }, [pageNumber, selectSearch, byPage]);

    const onClickSubmitHandler = () => {
        dispatcher(changeNumberPage(1))
        dispatcher(changeSelectSearch({...inputSearch}))
    }

    const onClickClearHandler = () => {
        dispatcher(changeInput({animal: '', amount: ''}))
    }

    const onChangeAnimalHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
        dispatcher(changeInput({...inputSearch, animal: event.target.value}))
    }
    const onChangeAmountHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
        dispatcher(changeInput({...inputSearch, amount: event.target.value}))
    }

    const onChangeLimitHandler = (event:React.ChangeEvent<HTMLSelectElement>) => {
        dispatcher(changeNumberPage(1))
        dispatcher(changeByPage(Number(event.target.value)))
    }

    const onClickNextHandler = () => {
        dispatcher(changeNumberPage(pageNumber + 1))
    }

    const onClickPrevHandler = () => {
        dispatcher(changeNumberPage(pageNumber - 1))
    }

    const switchListAnimals = (status:Statuses) => {
        switch (status) {
            case Statuses.pending:
                return <p>Loading...</p>
            case Statuses.fulfilled:
                return <ul>
                    {
                        animals.length > 0
                            ?
                            animals.map(animal => (
                                <li key={animal.id}>{animal.animal}, {animal.amount}</li>
                            ))
                            :
                            <p>Animals not found</p>
                    }
                </ul>
            case Statuses.rejected:
                return <p>{errorMessage}</p>
        }
    }
    return (
        <div className={'containerInner'}>
            <div className={'inputContainer'}>
                <input value={inputSearch.animal} onChange={(event) => onChangeAnimalHandler(event)} disabled={status === Statuses.pending} style={{width: '50%'}} type="text" name="inputAnimal" id="inputAnimal" placeholder='Animal'/>
                <input value={inputSearch.amount} onChange={(event) => onChangeAmountHandler(event)} disabled={status === Statuses.pending} style={{width: '50%'}} type="number" min='0' name="inputAmount" id="inputAmount" placeholder='Amount'/>
                <button onClick={() => onClickClearHandler()} disabled={status === Statuses.pending}>Clear</button>
            </div>
            <div className={'functionContainer'}>
                <div>
                    <label htmlFor="by-page">By page:</label>
                    <select name="by-page" id="by-page" disabled={status === Statuses.pending} onChange={(event) => onChangeLimitHandler(event)} defaultValue={byPage}>
                        {
                            [...Array(11)].map((_, i) => (
                                <option key={i} value={i+1}>{i + 1}</option>
                            ))
                        }
                    </select>
                </div>
                <div className={'pageSelectorContainer'}>
                    <button disabled={pageNumber === 1 || status === Statuses.pending} onClick={() => onClickPrevHandler()}>prev</button>
                    <p>page: {pageNumber}</p>
                    <button disabled={nextAnimals.length === 0 || status === Statuses.pending} onClick={() => onClickNextHandler()}>next</button>
                </div>
            </div>
            {switchListAnimals(status)}
            <button onClick={() => onClickSubmitHandler()} disabled={status === Statuses.pending}>Submit</button>
        </div>
    )
}

export default AnimalsForm