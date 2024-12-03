import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     singleCompany: null, // This will hold details of a single company
//     companies: [],       // This should be initialized as an empty array
// };

const companySlice = createSlice({
    name: 'company',
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
    },
    reducers: {
        //actions
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText:(state, action)=>{
            state.searchCompanyByText=action.payload;
        }
    }
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText} = companySlice.actions;
export default companySlice.reducer;