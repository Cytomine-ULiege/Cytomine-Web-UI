export default {
  namespaced: true,

  state() {
    return {
      previewSize: null,
      perPage: 25,
      outlineColor: null,

      annotationType: null,
      filters: {
        members: null,
        reviewers: null,
        userJobs: null,
        images: null,
        termsIds: null
      }
    };
  },

  mutations: {
    setPreviewSize(state, size) {
      state.previewSize = size;
    },

    setPerPage(state, perPage) {
      state.perPage = perPage;
    },

    setOutlineColor(state, color) {
      state.outlineColor = color;
    },

    setAnnotationType(state, type) {
      state.annotationType = type;
    },

    setFilter(state, {filterName, propValue}) {
      state.filters[filterName] = propValue;
    },

    resetFilters(state) {
      for(let key in state.filters) {
        state.filters[key] = null;
      }
    }
  }
};
