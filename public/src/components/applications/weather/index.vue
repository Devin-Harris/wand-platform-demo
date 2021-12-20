<template>
  <div class="weather">
    <div class="buttons">
      <label for="locationInput">Enter a Zip Code OR "City, State":</label>
      <input type="text" name="locationInput" v-model="mutatingLocationInput">
      <button @click="setLocationInput" :class="{'inactive': !mutatingLocationInput}">Submit</button>
    </div>

    <div v-if="locationInput" class="info">
      <a :class="{'shown': loadedEmbed === 1}" :href="`https://www.weatherusa.net/forecasts?q=${encodeURI(locationInput)}`">
        <img 
          :src="`http://www.weatherusa.net/forecasts/?forecast=hourly&amp;alt=hwicc&amp;config=png&amp;pands=${encodeURI(locationInput)}&amp;hwvdisplay=`" 
          :alt="`Click for Forecast for ${locationInput} from weatherUSA`" 
          :title="`Click for Forecast for ${locationInput} from weatherUSA`"
        />
      </a>

      <a :class="{'shown': loadedEmbed === 2}" :href="`https://www.weatherusa.net/forecasts?q=${encodeURI(locationInput)}`">
        <img 
          :src="`http://www.weatherusa.net/forecasts/?forecast=zone&amp;alt=hwizone7day&amp;daysonly=3&amp;config=png&amp;pands=${encodeURI(locationInput)}&amp;hwvdisplay=`" 
          :alt="`Click for Forecast for ${locationInput} from weatherUSA`" 
          :title="`Click for Forecast for ${locationInput} from weatherUSA`"
        />
      </a>

      <a :class="{'shown': loadedEmbed === 3}" :href="`https://www.weatherusa.net/forecasts?q=${encodeURI(locationInput)}`">
        <img 
          :src="`http://www.weatherusa.net/forecasts/?forecast=zandh&amp;alt=hwiws&amp;config=png&amp;pands=${encodeURI(locationInput)}&amp;hwvdisplay=`" 
          :alt="`Click for Forecast for ${locationInput} from weatherUSA`" l
          :title="`Click for Forecast for ${locationInput} from weatherUSA`"
        />
      </a>
    </div>

    <div v-if="locationInput" class="embed-chooser">
      <span v-for="i in 3" :key="'embedRadio-'+ i">
        <label @click="setLoadedEmbed(i)" for="radio">{{ i === 1 ? 'Current' : i === 2 ? 'Conditions' : 'Forecast' }}</label>
        <input type="radio" name="radio" id="embedRadio" @change="setLoadedEmbed(i)" :checked="loadedEmbed === i">
      </span>
    </div>
  </div>
</template>

<script src="./weather.js"></script>
<style src="./weather.scss" lang="scss"></style>
