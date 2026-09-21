import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpenInq: false,
  menuToggle: false,
  projects_full_list_detail: {},
  countryList: [],
  thankyouData: {
    page_name: '',
    document: []
  },
  inquiryPrefill: null,

}
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setInquiryPopup(state, action) {
      state.isOpenInq = action.payload;
      state.inquiryPrefill = action.payload || null;

    },
    setProjectsFullListDetail(state, action) {
      state.projects_full_list_detail = action.payload
    },
    setCountryList(state, action) {
      state.countryList = action.payload
    },
    setThankYouData(state, action) {
      state.thankyouData = action.payload
    },
    clearThankYouData(state) {
      state.thankyouData = initialState.thankyouData
    },
    closeInquiry: (state) => {
      state.isOpenInq = false;
      state.inquiryPrefill = null;
    },
    setMenuPopup: (state, action) => {
      state.menuToggle = action.payload;
    },
    setProjectDetail(state, action) {
      state.projectDetailInq = action.payload;
    },
  }
})

export const {
  setInquiryPopup,
  setProjectsFullListDetail,
  setCountryList,
  setThankYouData,
  closeInquiry,
  clearThankYouData,
  setMenuPopup,
  setProjectDetail,
} = projectSlice.actions
export default projectSlice.reducer
