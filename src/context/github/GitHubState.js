import React, { useReducer } from 'react';
import axios from 'axios';
import GitHubContext from './githubContext';
import GitHubReducer from './githubReducer';
import {
	SEARCH_USERS,
	SET_LOADING,
	CLEAR_USERS,
	GET_USER,
	GET_REPOS,
} from '../types';

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== 'production') {
	githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
	githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
	githubClientId = process.env.GITHUB_CLIENT_ID;
	githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GitHubState = (props) => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false,
	};

	const [state, dispatch] = useReducer(GitHubReducer, initialState);

	// Search users
	const searchUsers = async (text) => {
		setLoading();
		const result = await axios.get(
			`https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		const { data } = result;
		dispatch({
			type: SEARCH_USERS,
			payload: data.items,
		});
	};

	// Get user
	const getUser = async (username) => {
		setLoading();
		const result = await axios.get(
			`https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		const { data } = result;
		dispatch({
			type: GET_USER,
			payload: data,
		});
	};

	// Get repos
	const getUserRepos = async (username) => {
		setLoading();
		const result = await axios.get(
			`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		const { data } = result;
		dispatch({
			type: GET_REPOS,
			payload: data,
		});
	};

	// Clear users
	const clearUsers = () => dispatch({ type: CLEAR_USERS });

	// Set loading
	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<GitHubContext.Provider
			value={{
				users: state.users,
				user: state.user,
				repos: state.repos,
				loading: state.loading,
				searchUsers,
				clearUsers,
				getUser,
				getUserRepos,
			}}
		>
			{props.children}
		</GitHubContext.Provider>
	);
};

export default GitHubState;
