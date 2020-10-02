import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import "../../styles/home.scss";

import { CreateWatchlist } from "../component/createWatchlist.js";
import { TabContent } from "../component/tabContent.js";

//crear condicional para cuando no hay watchlists

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [key, setKey] = useState();
	const [watchlistId, setWatchlistId] = useState(store.watchlists[0].id);
	//chequear parámetro que se le pasa al tab content;
	//cambiar uso con dos variables. una para el fetch y otra para watchlists default
	//cambiar. hacer un fetch en lugar de mapear store.
	const userWatchlists = store.watchlists.map((element, index) => {
		index = index + 1;
		return (
			<Tab key={index} eventKey={element.id} title={element.name}>
				<TabContent watchlist={watchlistId.toString()} />
			</Tab>
		);
	});
	useEffect(
		() => {
			async function loadUserWatchlists() {
				if (store.token != null) {
					await actions.loadWatchlists();
					setWatchlistId(store.watchlists[0].id);
				}
			}
			loadUserWatchlists();
		},
		[store.token]
	);

	return (
		<section>
			<Tabs
				id="controlled-tab-example"
				activeKey={key}
				onSelect={k => {
					setKey(k);
					setWatchlistId(k);
					console.log("type key", typeof key);
				}}>
				{userWatchlists}
				<Tab key="0" eventKey="0" title="+">
					<CreateWatchlist />
				</Tab>
			</Tabs>
		</section>
	);
};
