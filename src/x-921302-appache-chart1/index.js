import { createCustomElement, actionTypes } from "@servicenow/ui-core";
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import { createHttpEffect } from "@servicenow/ui-effect-http";
import snabbdom from "@servicenow/ui-renderer-snabbdom";

import * as echarts from "echarts";
import styles from "./styles.scss";

const view = (state, { updateState }) => {
	const {
		incidentArray,
		// isChartExpanded = true,
		chartType = "bar",
		isChartVisible = true,
		containers = [
			{ 
				id: 1,
				isExpanded:true,
			},
			{ 
				id: 2,
				isExpanded:true,
			},
			{ 
				id: 3,
				isExpanded:true,
			}],
	} = state;

	let chartInstance = null ; 

	var InquiryCount = 0;
	var SoftwareCount = 0;
	var HardwareCount = 0;
	var NetworkCount = 0;
	var DatabaseCount = 0;
	var EmptyCount = 0;

	for (let item = 0; item < incidentArray.length; item++) {
		if (incidentArray[item].category == "inquiry") {
			InquiryCount += 1;
		}
		if (incidentArray[item].category == "software") {
			SoftwareCount += 1;
		}
		if (incidentArray[item].category == "hardware") {
			HardwareCount += 1;
		}
		if (incidentArray[item].category == "network") {
			NetworkCount += 1;
		}
		if (incidentArray[item].category == "database") {
			DatabaseCount += 1;
		}
		if (incidentArray[item].category == "") {
			EmptyCount += 1;
		}
	}

	const chartRef = (element) => {
		if (element) {
			const myChart = echarts.init(element);
			chartInstance = myChart; // Store the chart instance

			if (chartType === "bar") {
				const barOptions = {
					xAxis: {
						data: [
							"Empty",
							"Inquiry",
							"Software",
							"Hardware",
							"Network",
							"Database",
						],

						name: "Category",
						nameLocation: "end",
						show: true,
					},
					yAxis: {
						name: "Count/Category",
						nameLocation: "end",
						axisLabel: {
							align: "center",
						},
						type: "value",
						show: true,
					},
					tooltip: {
						trigger: "item",
					},
					series: [
						{
							data: [
								EmptyCount,
								InquiryCount,
								SoftwareCount,
								HardwareCount,
								NetworkCount,
								DatabaseCount,
							],
							type: "bar",
						},
					],
				};
				myChart.setOption(barOptions);
			} else if (chartType === "pie") {
				const pieOptions = {
					xAxis: {
						show: false,
					},
					yAxis: {
						show: false,
					},

					legend: {
						orient: "vertical",
						left: "left",
					},

					series: [
						{
							data: [
								{ value: EmptyCount, name: "Empty" },
								{ value: InquiryCount, name: "Inquiry" },
								{ value: SoftwareCount, name: "Software" },
								{ value: HardwareCount, name: "Hardware" },
								{ value: NetworkCount, name: "Network" },
								{ value: DatabaseCount, name: "Database" },
							],
							type: "pie",
							radius: "70%",
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: "rgba(0, 0, 0, 0.5)",
								},
							},
						},
					],
				};

				myChart.setOption(pieOptions);
			}

			// Handle bar click event
			myChart.on("click", (params) => {
				var endPoint = params.name.toLowerCase();
				let redirectURL = "";

				if (endPoint === "inquiry") {
					redirectURL =
						"https://dev90864.service-now.com/incident_list.do?sysparm_query=category%3Dinquiry&sysparm_view=";
				} else if (endPoint === "software") {
					redirectURL =
						"https://dev90864.service-now.com/incident_list.do?sysparm_query=category%3Dsoftware&sysparm_view=";
				} else if (endPoint === "hardware") {
					redirectURL =
						"https://dev90864.service-now.com/incident_list.do?sysparm_query=category%3Dhardware&sysparm_view=";
				} else if (endPoint === "network") {
					redirectURL =
						"https://dev90864.service-now.com/incident_list.do?sysparm_query=category%3Dnetwork&sysparm_view=";
				} else if (endPoint === "database") {
					redirectURL =
						"https://dev90864.service-now.com/incident_list.do?sysparm_query=category%3Ddatabase&sysparm_view=";
				} else {
					redirectURL =
						"https://dev90864.service-now.com/now/nav/ui/classic/params/target/incident_list.do%3Fsysparm_query%3D%26sysparm_first_row%3D1%26sysparm_view%3D";
				}
				window.location.href = redirectURL;
			});
		}
	};

	// Handle chart type change event

	const handleChartTypeChange = (event) => {
		const selectedChartType = event.target.value;
		if (selectedChartType === "bar") {
			updateState({ chartType: "bar" });
		}
		if (selectedChartType === "pie") {
			updateState({ chartType: "pie" });
		}
		// updateState({ chartType: selectedChartType });
	};
	// Handle chart collapse and expand event
	const handleCollapseExpand = (id) => {
		// updateState({ isChartExpanded: !isChartExpanded });
		const updatedContainers = containers.map((container) => {
			if (container.id === id) {
				return { ...container, isExpanded : !container.isExpanded  };
			}
			return container;
		});
		updateState({ containers: updatedContainers });
	};

	// Handle chart Deletion event
	const handleDelete = (id) => {
		const updatedContainers = containers.filter(
			(container) => container.id !== id
		);
		updateState({ containers: updatedContainers });
		alert('Deleted Successfully')
	};

	//  Handle chart Drag and Drop event
	



	// VIEW
	return (
		<div>
			{containers.map((container) => (
				<div
					className="box"
					key={container.id}
					style={{ display: isChartVisible ? "block" : "none" }}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<h2>Report for all Incidents Categories</h2>

						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							{/* Chart type */}
							<div className="form-select" style={{ marginRight: "1rem" }}>
								<select value={chartType} on-change={handleChartTypeChange}>
									<option selected="true" disabled="true">
										{chartType} Selected
									</option>
									<option value="bar">Bar</option>
									<option value="pie">Pie</option>
								</select>
							</div>

							{/* Collapse || Expand  Chart  */}
							<div className="btn btn-primary" style={{ marginRight: "1rem" }}>
								<button
									type="button"
									on-click={() => handleCollapseExpand(container.id)}
								>
									{container.isExpanded  ? "Collapse" : "Expand"}
								</button>
							</div>

							{/* Delete Chart  */}
							<div className="btn btn-primary" style={{ marginRight: "1rem" }}>
								<button
									type="button"
									on-click={() => handleDelete(container.id)}
								>
									Delete
								</button>
							</div>
						</div>
					</div>

					{/* Chart canvas */}
					<div
						ref={chartRef}
						style={{
							display: container.isExpanded ? "block" : "none",
							width: "700%",
							height: "500%",
						}}
					></div>
				</div>
			))}
		</div>
	);
};

createCustomElement("x-921302-appache-chart1", {
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { dispatch } = coeffects;

			dispatch("FETCH_LATEST_INCIDENT", {
				// sysparm_limit: "67",
				// sysparm_query: "state=2",
			});
		},

		FETCH_LATEST_INCIDENT: createHttpEffect("api/now/table/incident", {
			method: "GET",
			queryParams: ["sysparm_limit"],
			successActionType: "FETCH_LATEST_INCIDENT_SUCCESS",
		}),

		FETCH_LATEST_INCIDENT_SUCCESS: (coeffects) => {
			const { action, updateState } = coeffects;
			const { result } = action.payload;
			const incidentArray = result;
			// const { number, short_description } = result[0];

			updateState({ incidentArray });
		},
	},

	renderer: { type: snabbdom },
	view,
	styles,
});
