package com.travelplanner.agent.tools;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class WeatherTool {

    public Map<String, Object> getWeatherForecast(String destinationName, int totalDays) {
        Map<String, Object> forecast = new HashMap<>();
        forecast.put("destination", destinationName);
        forecast.put("averageTemperatureC", 24);
        forecast.put("averageTemperatureF", 75);
        forecast.put("condition", "Partly Cloudy");
        forecast.put("rainProbabilityPercent", 15);
        forecast.put("packingSuggestions", "Light breathable clothes, comfortable sneakers, light cardigan for evenings, compact umbrella.");
        forecast.put("suitableOutdoorDays", totalDays > 1 ? totalDays - 1 : 1);
        forecast.put("recommendedIndoorAlternatives", "State art gallery, local history museum, boutique indoor covered bazaars.");
        return forecast;
    }
}
