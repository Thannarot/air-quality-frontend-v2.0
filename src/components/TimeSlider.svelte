<script type="ts">

    import RangeSlider from "svelte-range-slider-pips";
	import { DateInput } from 'date-picker-svelte'
	// import { CalendarWeekSolid, CaretLeftOutline, CaretRightOutline } from 'flowbite-svelte-icons';
	import { forecastedDate, forecastedTime, intializationDate, selectedDate_str, selectedTime_str } from '../stores/dateTimeStore';
	import axios from 'axios';
	import { onMount } from 'svelte';

	let date = new Date();
	let picker_date = new Date();
	let values = [10];
	let pipstep = 1;
	let hourOptions = [];


	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


	function DatetoStringFormat(d) {
		let month = '' + (d.getMonth() + 1);
		let day = '' + d.getDate();
		let year = d.getFullYear();
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		return [year, month, day].join('-');
	}

	let nowDateString = DatetoStringFormat(new Date())

	$: if (picker_date) {
		let picker_year = picker_date.getFullYear();
		let picker_month = picker_date.getMonth();
		let picker_getdate = picker_date.getDate();
		let picker_day = picker_date.getDay();

		$selectedDate_str = days[picker_day] + ' ' + months[picker_month] + ' ' + picker_getdate + ' ' + picker_year
		forecastedDate.set(DatetoStringFormat(picker_date));
	}

    function timesList(start, end, minutes_step){
		let dateStart = moment(`2017-08-30T${start}:00`);
		let dateEnd = moment(`2017-08-30T${end}:00`).subtract(minutes_step, 'hours');
		let times = [];
		times.push(dateStart.format("HH"));
		hourOptions.push(dateStart.format("H"));
		while (times[times.length - 1] < dateEnd.format("HH")){
		times.push(dateStart.add(minutes_step, 'hours').format("HH"));
		hourOptions.push(dateStart.format("H"));
		}
		return(times)
	};
	let timeListSlider = timesList("01:00","24:00",3)
	pipstep = 1;

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
		intializationDate.set(initDate);
		// Set forecaseted Time 
		forecastedTime.set(forecastTime);
		// Forecasted date,  default should be now date 
		forecastedDate.set(nowDateString);
	})
	.catch(error => { console.error(error); throw error; });
	}

	function next() {
		if (values[0] === timeListSlider.length - 1){
			values = [0];
		}else {
			values = [values[0]+1]
		}
		forecastedTime.set(timeListSlider[values]);
		$selectedTime_str = timeListSlider[values]

	}

	function prev() {
		if (values[0] === 0){
			values = [timeListSlider.length - 1];
		}else {
			values = [values[0]-1]
		}
		forecastedTime.set(timeListSlider[values]);
		$selectedTime_str = timeListSlider[values]
	}

	function setforecastedTime(event) {
		forecastedTime.set(timeListSlider[event.detail.value]);
		$selectedTime_str = timeListSlider[event.detail.value]
	}

	onMount(async () => {
		let now_hour = date.getHours();
		let closestHourOption = hourOptions.reduce(function(prev, curr) {
			return (Math.abs(curr - now_hour) < Math.abs(prev - now_hour) ? curr : prev);
		});
		let TimeIndexOption = hourOptions.findIndex(x => x === closestHourOption);

		values = [TimeIndexOption];
		$selectedTime_str = timeListSlider[TimeIndexOption];
		getInitDate(timeListSlider[TimeIndexOption], nowDateString)
	});


</script>


<div class="timeslider-class" >
	<div id="timeslider" class="flex justify-center items-center">
		<div class="flex p-2 border-end border-start">
			<div class="text-center">
				<p class="font-bold text-purple-900 mb-0">{$selectedDate_str}</p>
				<p class="mb-0">{$selectedTime_str}:00:00 </p>
			</div>
		</div>
	
		<div class="flex p-2 border-end">
			<div class="">
				<DateInput bind:value={picker_date} dynamicPositioning=true closeOnSelection format="yyyy-MM-dd" placeholder=""/>
			</div>
		</div>
	
		<div class="basis-1/2" style="width: -webkit-fill-available;">
			<div class="p-2" style="width: -webkit-fill-available;">
				<RangeSlider id="time-range"
				on:change={(e) => setforecastedTime(e)}
				formatter={ v => timeListSlider[v] } 
				max={ timeListSlider.length - 1 } 
				range="min" 
				suffix="h" 
				pushy 
				pips 
				bind:pipstep 
				all="label" 
				float 
				bind:values />
			</div>
		</div>
	
		<div class="flex p-2 border-end border-start">
			<div class="">
				<div id="timeslider-btn" class="flex">
					<!-- <CaretLeftOutline on:click={prev} size="xl" class="text-purple-900" ></CaretLeftOutline>
					<CaretRightOutline on:click={next} size="xl" class="text-purple-900" ></CaretRightOutline> -->
				</div>
	
			</div>
			
		</div>
	</div>
</div>



<style>

	:root {
		--date-input-width: 90px;
		--date-picker-background: rgba(248, 250, 252, 0.7);
		--range-slider:            hsl(180, 3.9%, 84.9%);
		--range-handle-inactive:   hsl(233, 63%, 54%);
		--range-handle:            hsl(234, 67.6%, 71%);
		--range-handle-focus:      hsl(244.1, 63.2%, 54.1%);
		--range-handle-border:     hsl(234, 67.6%, 71%);
		--range-range-inactive:    hsl(244.1, 62.6%, 53.9%);
		--range-range:             hsl(244.1, 63.2%, 54.1%);
		--range-float-inactive:    hsl(244.1, 62.6%, 53.9%);
		--range-float:             hsl(244.1, 63.2%, 54.1%);
		--range-float-text:        hsl(0, 0%, 100%);

		--range-pip:               hsl(0, 0%, 42%);
		--range-pip-text:          hsl(0, 0%, 38%);
		--range-pip-active:        hsl(180, 25.4%, 24.7%);
		--range-pip-active-text:    hsl(244.1, 62.6%, 53.9%);
		--range-pip-hover:         hsl(180, 25.4%, 24.7%);
		--range-pip-hover-text:    hsl(180, 25.4%, 24.7%);
		--range-pip-in-range:      hsl(180, 25.4%, 24.7%);
		--range-pip-in-range-text: hsl(180, 25.4%, 24.7%);
	}
	#time-range {
		font-size: 10px;
	}

	.flex svg {
		cursor: pointer;
	}

	.timeslider-class {
		width: 53%;
    	background-color: rgba(248, 250, 252, 0.7);
		font-size: 12px;
	}
	.border-start {
		border-left: 1px solid #ddd;
	}
	#timeslider .border-end{
		border-right: 1px solid #ddd;
    	padding: 5px;
	}
	
</style>
