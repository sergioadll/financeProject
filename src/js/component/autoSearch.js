import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Autocomplete from "react-autocomplete";
import "../../styles/search.scss";

export const AutoSearch = () => {
	const { store, actions } = useContext(Context);

	const [value, setValue] = useState("");
	const debouncedSearchTerm = useDebounce(value, 500);
	const [symbol, setSymbol] = useState("");

	useEffect(() => {
		actions.loadStocksInfo();
	}, []);
	return (
		<div className="d-flex justify-content-center">
			<div className="card mb-2 mt-3 bg-light rounded-pill p-0 searchBg on-top">
				<form className="form-inline my-1 d-flex justify-content-center">
					<Autocomplete
						items={store.allStocks}
						getItemValue={item => item.symbol}
						shouldItemRender={(item, debouncedSearchTerm) =>
							item.symbol.toLowerCase().indexOf(debouncedSearchTerm.toLowerCase()) > -1 ||
							item.name.toLowerCase().indexOf(debouncedSearchTerm.toLowerCase()) > -1
						}
						hideResults={true}
						renderItem={(item, isHighlighted) => (
							<div
								key={item.id}
								className="d-flex px-2"
								style={{ background: isHighlighted ? "lightgray" : "white" }}>
								{item.symbol}
								<span className="ml-auto">{item.name}</span>
							</div>
						)}
						value={value}
						onChange={e => setValue(e.target.value)}
						onSelect={val => {
							setSymbol("/details/".concat(val));
							setValue(val);
						}}
						menuStyle={{
							borderRadius: "0.1rem",
							boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
							background: "rgba(255, 255, 255, 1)",
							padding: "0.1rem 0",
							fontSize: "90%",
							position: "fixed",
							overflow: "auto",
							maxHeight: "20%"
						}}
						inputProps={{
							placeholder: "Insert Stock Name or Symbol",
							className: "search mr-sm-2 p-2 rounded-pill"
						}}
					/>
					<Link
						to={symbol}
						className="btn btn-outline-primary my-sm-0 rounded-pill"
						id="submit"
						type="submit">
						Go!
					</Link>
				</form>
			</div>
		</div>
	);
	function useDebounce(value, delay) {
		const [debouncedValue, setDebouncedValue] = useState(value);
		useEffect(
			() => {
				const handler = setTimeout(() => {
					setDebouncedValue(value);
				}, delay);
				return () => {
					clearTimeout(handler);
				};
			},
			[value, delay] // Only re-call effect if value or delay changes
		);
		return debouncedValue;
	}
};
