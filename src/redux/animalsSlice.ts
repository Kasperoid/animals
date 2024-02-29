import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Animal, requestAnimals} from "../api";
import {Statuses} from "../enums";

export const asyncAnimals = createAsyncThunk<Animal[], {animal:string, amount:string, limit: number, offset: number}, {rejectValue: string}>(
    'animals/async',
    async function (inputData, {rejectWithValue}) {
        try {
            const data = await requestAnimals({...inputData})
            // const data = await requestAnimalsWithError({...inputData})
            return data
        }
        catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            } else {
                return rejectWithValue('Неизвестная ошибка!')
            }
        }
    }
)

export const asyncNextAnimals = createAsyncThunk<Animal[], {animal:string, amount:string, limit: number, offset: number}, {rejectValue: string}>(
    'nextAnimals/async',
    async function (inputData, {rejectWithValue}) {
        try {
            const data = await requestAnimals({...inputData})
            // const data = await requestAnimalsWithError({...inputData})
            return data
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            } else {
                return rejectWithValue('Неизвестная ошибка!')
            }
        }
    }
)

interface ISearch {
    animal: string;
    amount: string;
}

interface IAnimalsState {
    animals: Animal[];
    nextAnimals: Animal[];
    status: Statuses;
    byPage: number;
    pageNumber: number;
    selectedSearch: ISearch;
    inputSearch: ISearch;
    errorMessage: string | undefined;
}

const initialState:IAnimalsState = {
    animals: [],
    nextAnimals: [],
    status: Statuses.pending,
    byPage: 4,
    pageNumber: 1,
    selectedSearch: {
        animal: '',
        amount: '',
    },
    inputSearch: {
        animal: '',
        amount: ''
    },
    errorMessage: undefined
}

const animalsSlice = createSlice({
    name: 'animals',
    initialState,
    reducers: {
        changeByPage (state, action:PayloadAction<number>) {
            state.byPage = action.payload
        },

        changeNumberPage (state, action:PayloadAction<number>) {
            state.pageNumber = action.payload
        },

        changeSelectSearch (state, action:PayloadAction<ISearch>) {
            state.selectedSearch = {...action.payload}
        },

        changeInput (state, action:PayloadAction<ISearch>) {
            state.inputSearch = {...action.payload}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(asyncAnimals.fulfilled, (state, action) => {
            state.status = Statuses.fulfilled
            state.animals = action.payload
        })
        builder.addCase(asyncAnimals.pending, (state) => {
            state.status = Statuses.pending
        })
        builder.addCase(asyncAnimals.rejected, (state, action) => {
            state.status = Statuses.rejected
            state.errorMessage = action.payload
        })
        builder.addCase(asyncNextAnimals.fulfilled, (state, action) => {
            state.nextAnimals = action.payload
        })
        builder.addCase(asyncNextAnimals.rejected, (state, action) => {
            state.nextAnimals = []
            state.errorMessage = action.payload
        })
    }
})

export const {changeByPage, changeNumberPage, changeSelectSearch, changeInput} = animalsSlice.actions
export default animalsSlice.reducer