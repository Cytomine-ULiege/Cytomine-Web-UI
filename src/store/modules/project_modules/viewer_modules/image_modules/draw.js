export default {
  state() {
    return {
      activeTool: 'select',

      termsNewAnnots: [],

      activeEditTool: null,
      ongoingEdit: false
    };
  },

  mutations: {
    activateTool(state, tool) {
      state.activeTool = tool;
    },

    activateEditTool(state, tool) {
      state.activeEditTool = tool;
    },

    setOngoingEdit(state, value) {
      state.ongoingEdit = value;
    },

    setTermsNewAnnots(state, terms) {
      state.termsNewAnnots = terms;
    },

    filterTermsNewAnnots(state, terms) { // keep only the terms that still exist
      let idTerms = terms.map(term => term.id);
      state.termsNewAnnots = state.termsNewAnnots.filter(id => idTerms.includes(id));
    },
  },

  actions: {
    activateTool({state, commit}, tool) {
      let previousTool = state.activeTool;
      if(previousTool === 'select' && tool !== 'select') {
        commit('clearSelectedFeatures');
        commit('activateEditTool', {tool: null});
      }
      commit('activateTool', tool);
    },

    refreshData({commit, rootGetters}) {
      commit('filterTermsNewAnnots', rootGetters.terms || []);
    }
  }
};
