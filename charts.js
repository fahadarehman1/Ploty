function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArr = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumbers = samplesArr.filter(data => data.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleNumbers[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIdsSample = firstSample.otu_ids;
    var otuLabelsSample = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIdsSample.slice(0,10).map(id => "OTU " + id).reverse(); 
    var xticks = sampleValues.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      orientation: 'h',
      type: "bar",
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
     xaxis: { title: "Sample Values" },
     yaxis: { title: "Top 10 OTU Ids"},
     margin: {t:30,l:100}
     };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

// -------------------------------------------------------------------------  
// Bar and Bubble charts
// -------------------------------------------------------------------------


//Assign the otu_ids, sample_values, and otu_labels to the x, y, and text properties, respectively.
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
      x: otuIdsSample,
      y: sampleValues,
      text: otuLabelsSample,
      mode: 'markers',
      marker: { 
        size: sampleValues,
        color: otuIdsSample,
        colorscale: "Earth"
              }
      }
    ];


    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: "OTU ID" },
      yaxis: { title: ""},
      hovermode: "closest",
      height: 600,
      width: 1200  
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// -------------------------------------------------------------------------
// Gauge Chart Code
// -------------------------------------------------------------------------

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataSampleNbr = data.metadata.filter(data => data.id == sample);
    

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataSampleOne = metadataSampleNbr[0];

    
    // 3. Create a variable that holds the washing frequency.
    var washFreq = metadataSampleOne.wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: washFreq,
        type: "indicator",
        mode: "gauge+number",
        title: "<b> Belly Button Washing Frequency</b> <br>Scrubs per week",
        domain: { x: [0, 1], y: [0, 1] },
        gauge: {
          axis: { range: [null, 10],
          tickvals: [0,2,4,6,8,10]
          },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red"},
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "lime"},
            { range: [8, 10], color: "green"}],
          threshold: {
            thickness: 0.75}  
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
    //  title: 'Scrubs per Week',
      autosize: true 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

});
}