import {Cytomine, Project, ProjectConnection, Ontology, AnnotationType} from "cytomine-client";
import {fullName} from "@/utils/user-utils.js";
import {getAllTerms} from "@/utils/ontology-utils";

export default {
    state: {
        project: null,
        configUI: {},
        ontology: null,
        managers: [],
        members: []
    },

    mutations: {
        logout(state) {
            state.project = null;
            state.configUI = {};
            state.ontology = null;
            state.managers = [];
            state.members = [];
        },

        setProject(state, project) {
            state.project = project;
        },

        setOntology(state, ontology) {
            state.ontology = ontology;
        },

        setConfigUI(state, config) {
            state.configUI = config;
        },

        setManagers(state, managers) {
            state.managers = managers;
        },

        setMembers(state, members) {
            state.members = members;
        },
    },

    actions: {
        async loadProject({state, dispatch, commit}, idProject) {
            let projectChange = state.project == null || state.project.id != idProject;
            let project = await Project.fetch(idProject);
            commit("setProject", project);

            let promises = [
                dispatch("fetchUIConfig"),
                dispatch("fetchOntology"),
                dispatch("fetchProjectMembers")
            ];

            if(projectChange) {
                promises.push(new ProjectConnection({project: idProject}).save());
            }
            await Promise.all(promises);
        },

        async fetchUIConfig({state, commit}) {
            let config = await Cytomine.instance.fetchUIConfigCurrentUser(state.project.id);
            commit("setConfigUI", config);
        },

        async fetchProjectMembers({state, commit}) {
            let managersPromise = state.project.fetchAdministrators();
            let membersPromise = state.project.fetchUsers();

            let managers = (await managersPromise).array;
            let members = (await membersPromise).array;

            members.forEach(member => member.fullName = fullName(member));

            commit("setManagers", managers);
            commit("setMembers", members);
        },

        async fetchOntology({state, commit}) {
            let ontology = await Ontology.fetch(state.project.ontology);
            commit("setOntology", ontology);
        }
    },

    getters: {
        canEditLayer: (state, getters, rootState) => idLayer => {
            let currentUser = rootState.currentUser.user;
            let project = state.project;
            return getters.canManageProject || (!project.isReadOnly && (idLayer == currentUser.id || !project.isRestricted));
        },

        canEditAnnot: (_, getters, rootState) => annot => {
            let currentUser = rootState.currentUser.user;
            let idLayer = annot.user;
            if(annot.type === AnnotationType.REVIEWED) {
                return currentUser.adminByNow || annot.reviewUser === currentUser.id;
            }
            return getters.canEditLayer(idLayer);
        },

        canManageProject: (state, _, rootState) => { // true iff current user is admin or project manager
            let currentUser = rootState.currentUser.user || {};
            return currentUser.adminByNow || state.managers.some(user => user.id == currentUser.id);
        },

        contributors: (state) => {
            let idsManagers = state.managers.map(user => user.id);
            return state.members.filter(user => !idsManagers.includes(user.id));
        },

        terms: (state) => {
            return getAllTerms(state.ontology);
        }
    }
};
