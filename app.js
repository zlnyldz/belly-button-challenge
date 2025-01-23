// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var metadata = data.metadata;

    // Ensure the sample is a number
    var sampleId = +sample;  // Ensure it's an integer
    
    // Filter the metadata for the object with the desired sample number
    var result = metadata.filter(sampleObj => sampleObj.id === sampleId)[0];

    // Select the panel where metadata will be displayed
    var PANEL = d3.select("#sample-metadata");
    PANEL.html(""); // Clear any existing metadata

    // If sample exists, display metadata; else, log an error
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h5").text(`${key}: ${value}`);
      });
    } else {
      console.error("No data found for sample ID:", sample);
    }
  });
}

// Function to build the bar chart and bubble chart
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Get the top 10 OTUs based on sample_values for the bar chart
    let top10Values = sample_values.slice(0, 10).reverse();
    let top10OtuIds = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let top10OtuLabels = otu_labels.slice(0, 10).reverse();

    // Build a horizontal bar chart
    let barData = [{
      type: "bar",
      x: top10Values,
      y: top10OtuIds,
      text: top10OtuLabels,
      orientation: 'h'
    }];
    
    // Define the layout for the bar chart
    let barLayout = {
      title: 'Top 10 OTUs for Sample ' + sample,
      xaxis: {
        title: 'Sample Values'
      },
      yaxis: {
        title: 'OTU ID'
      }
    };

    // Render the bar chart
    Plotly.newPlot("bar", barData, barLayout);

    // Build the bubble chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];
    
    // Define the layout for the bubble chart
    let bubbleLayout = {
      title: 'Bubble Chart of Sample ' + sample,
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' },
      showlegend: false,
      height: 600,
      width: 1000
    };

    // Render the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
    // Get the names field (the sample names list)
    var sampleNames = data.names;
  
    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    // Loop through the sampleNames list and append a new option for each sample name
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });
  
    // Get the first sample from the list (this will be the default selection)
    var firstSample = sampleNames[0];
  
    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener when a new sample is selected
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
