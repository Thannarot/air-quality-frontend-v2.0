<script type="ts">
	import { forecastedDate, forecastedTime, intializationDate } from '../stores/dateTimeStore';
	import axios from 'axios';
	import { onMount } from 'svelte';
	// const dateTimes = data['times']

	let now = new Date();
    let DAY_MS = 86400000;  // 1 day in milliseconds
    let dates = [];

	function DatetoStringFormat(date) {
		let month = '' + (date.getMonth() + 1);
		let day = '' + date.getDate();
		let year = date.getFullYear();
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		return [year, month, day].join('-');
	}

	for (let i = 0; i < 10; i++) {
		let dateBefore = DatetoStringFormat(new Date(now.getTime() - (i * DAY_MS)))
		dates.push(dateBefore);
		if (i < 3) {
			let dateAfter = DatetoStringFormat(new Date(now.getTime() + (i * DAY_MS)))
			dates.push(dateAfter);
		}
	}
	dates = [...new Set(dates.sort())]

	let nowDateString = DatetoStringFormat(now)
	let dateIndex = dates.findIndex(x => x === nowDateString);

	let dateTimeData = [];
	let timesRes = ['01h', '04h', '07h', '10h', '13h', '16h', '19h', '22h'];
	let dateRes = dates.slice(dateIndex-1, dateIndex+3);

	let error = null;

	async function getInitDate(forecastTime, nowDateString) {
      let dataUrl = "/api/mapclient/";
      let params = {
        action: 'get-latest-date',
        dataset: 'geos'
      }

      await axios.get(dataUrl,
        {
          params,
          headers: { Authorization: `admin.KRg06uWinwXAL5SRRCBSmH2HON4tZKdpCItHpbZh7HghJFFH6mIizlNM01` }
        }).then(result => {  
          let initDate = result.data.slice(0, 4) + '-' + result.data.substr(4, 2) + '-' + result.data.substr(6, 2);
        //   console.log(initDate)
		//   return initDate;
			intializationDate.set(initDate);
		  // Set forecaseted Time 
			forecastedTime.set(forecastTime);
			// Forecasted date,  default should be now date 
			forecastedDate.set(nowDateString);
        })
        .catch(error => { console.error(error); throw error; });
      }

	function getforecastedTime(event) {
		forecastedTime.set(event.target.value);
	}

	function getforecastedDate(event) {
		forecastedDate.set(event.target.value);
	}

	function next3h() {
		let timeCurrentIndex = timesRes.findIndex(x => x === $forecastedTime);
		let dateCurrentIndex = dateRes.findIndex(x => x === $forecastedDate);
		// get next time button id
		if ($forecastedTime === '22h'){
			let next3hour = timesRes[0]

			if ($forecastedDate === dateRes[dateRes.length - 1]){
				let ind = dates.findIndex(x => x === $forecastedDate);
				dateRes = dates.slice(ind-1, ind+3);

				let newDay = dateRes[dateRes.length - 1]
				setTimeout(()=> {
					let buttonObjD = document.getElementById(newDay);
					buttonObjD.click();
				}, 50)
					
			}
			else{
				let newDay = dateRes[dateCurrentIndex + 1]
				let buttonObjD = document.getElementById(newDay);
				buttonObjD.click();
			}

			let buttonObjH = document.getElementById(next3hour);
			buttonObjH.click();

		} else {
			let next3hour = timesRes[timeCurrentIndex + 1]
			let buttonObj = document.getElementById(next3hour);
			buttonObj.click();
		}
	}

	function last3h() {
		let timeCurrentIndex = timesRes.findIndex(x => x === $forecastedTime);
		let dateCurrentIndex = dateRes.findIndex(x => x === $forecastedDate);
		// get next time button id
		if ($forecastedTime === '01h'){
			let last3hour = timesRes[7]

			if ($forecastedDate === dateRes[0]){
				let ind = dates.findIndex(x => x === $forecastedDate);
				dateRes = dates.slice(ind-1, ind+3);

				let newDay = dateRes[0]
				setTimeout(()=> {
					let buttonObjD = document.getElementById(newDay);
					buttonObjD.click();
				}, 50)
					
			}
			else{
				let newDay = dateRes[dateCurrentIndex - 1]
				let buttonObjD = document.getElementById(newDay);
				buttonObjD.click();
			}
			let buttonObjH = document.getElementById(last3hour);
				buttonObjH.click();
	
		} else {
			let last3hour = timesRes[timeCurrentIndex - 1]
			let buttonObj = document.getElementById(last3hour);
			buttonObj.click();
		}
	}

	onMount(async () => {
		// get closest hour option of now time in datetime selector 
		let hourOptions = [1, 4, 7, 10, 13, 16, 19, 22];
		let now_hour = now.getHours();

		let closestHourOption = hourOptions.reduce(function(prev, curr) {
			return (Math.abs(curr - now_hour) < Math.abs(prev - now_hour) ? curr : prev);
		});
		let TimeIndexOption = hourOptions.findIndex(x => x === closestHourOption);

		getInitDate(timesRes[TimeIndexOption], nowDateString)

	});
</script>

<div class="flex justify-center items-stretch">
	<div class="flex">
		<button
			on:click={last3h}
			class="btn_backward bg-slate-50 border-solid border-slate-50/50 p-0.5 mb-0.5 text-btn-xxs mr-1 bg-opacity-40"
			>-3h</button
		>
	</div>

	<div class="basis-1/2">
		<div class="flex-col">
			{#if timesRes}
				<div
					class="grid justify-items-stretch btn-group special btn-group-vertical lg:btn-group-horizontal"
				>
					{#each timesRes as time}
						{#if time == $forecastedTime}
							<button
								on:click={getforecastedTime}
								id={time}
								value={time}
								class="justify-self-auto bg-white border-solid border-r border-slate-50/50 p-0.5 mb-1 text-btn-xxs text-purple-800 bg-opacity-90"
								>{time}</button
							>
						{:else}
							<button
								on:click={getforecastedTime}
								id={time}
								value={time}
								class="justify-self-auto bg-slate-50 border-solid border-r border-slate-50/50 p-0.5 mb-1 text-btn-xxs bg-opacity-40 hover:bg-white hover:text-purple-800"
								>{time}</button
							>
						{/if}
					{/each}
				</div>
			{/if}

			{#if dateRes}
				<div
					class="grid justify-items-stretch btn-group special btn-group-vertical gap-1 lg:btn-group-horizontal"
				>
					{#each dateRes as date}
						{#if date == $forecastedDate}
							<button
								on:click={getforecastedDate}
								id={date}
								value={date}
								class=" justify-self-auto bg-white p-0.5 text-btn-xxs w-auto text-purple-800 bg-opacity-90"
								>{date}</button
							>
						{:else}
							<button
								on:click={getforecastedDate}
								id={date}
								value={date}
								class=" justify-self-auto bg-slate-50 p-0.5 text-btn-xxs w-auto bg-opacity-40 hover:bg-white hover:text-purple-800"
								>{date}</button
								>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="flex">
		<button
			on:click={next3h}
			class="btn_next bg-slate-50 border-solid border-slate-50/50 p-0.5 mb-0.5 text-btn-xxs bg-opacity-40 ml-1"
			>+3h</button
		>
	</div>
</div>

<style>
	.text-btn-xxs {
		font-size: 12px;
	}
	.btn-group.special {
		display: flex;
	}

	.special button {
		flex: 1;
	}
	.z-9999 {
		z-index: 9999;
	}

	.btn_next {
		position: relative;
		background: rgb(248 250 252 / var(--tw-bg-opacity));
		line-height: 46px;
		display: inline-block;
		padding: 0 5px;
		transition: 0.4s;
	}
	.btn_next:after,
	.btn_next:before {
		left: 100%;
		top: 50%;
		border: solid transparent;
		content: ' ';
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		transition: 0.4s;
	}

	.btn_next:after {
		border-left-color: rgb(248 250 252 / var(--tw-bg-opacity));
		border-width: 24px;
		margin-top: -24px;
	}
	.btn_next:before {
		margin-top: -26px;
		margin-left: 2px;
	}
	.btn_next:hover {
		color: #000;
		background: #fff;
	}
	.btn_next:hover:after {
		border-left-color: #fff;
	}

	.btn_backward {
		position: relative;
		background: rgb(248 250 252 / var(--tw-bg-opacity));
		line-height: 46px;
		display: inline-block;
		padding: 0 5px;
		transition: 0.4s;
	}
	.btn_backward:after,
	.btn_backward:before {
		right: 100%;
		top: 50%;
		border: solid transparent;
		content: ' ';
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		transition: 0.4s;
	}

	.btn_backward:after {
		border-right-color: rgb(248 250 252 / var(--tw-bg-opacity));
		border-width: 24px;
		margin-top: -24px;
	}
	.btn_backward:before {
		border-width: 26px;
		margin-top: -26px;
		margin-left: 2px;
	}
	.btn_backward:hover {
		color: #000;
		background: #fff;
	}
	.btn_backward:hover:after {
		border-right-color: #fff;
	}
</style>
