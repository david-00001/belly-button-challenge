// URL to sample data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data
d3.json(url).then(function(data) {

  // Retrieve names array for dropdown
  var names = data.names;

  // Populate the dropdown menu
  var dropdown = d3.select("#selDataset");
  names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });
      
  // Function to handle changes in the dropdown selection
  function optionChanged(selectedName) {
    // Filter data for selected individual
    var individualData = data.samples.find(function(sample) {
      return sample.id === selectedName;
    });
        
    // Activate function when dropdown changes
    dropdown.on("change", function() {
      var selectedName = dropdown.property("value");
      optionChanged(selectedName);
    });
    
    // Get the data for both bar and bubble charts
    var topTenOTUIds = individualData.otu_ids.slice(0, 10).map(String).reverse();
    var topTenSampleValues = individualData.sample_values.slice(0, 10).reverse();
    var topTenOTULabels = individualData.otu_labels.slice(0, 10).reverse();
    var otuIds = individualData.otu_ids;
    var sampleValues = individualData.sample_values;
    var otuLabels = individualData.otu_labels;

    
    // Create the bar chart
    var barTrace = {
      type: "bar",
      orientation: "h",
      x: topTenSampleValues,
      y: topTenOTUIds,
      text: topTenOTULabels,
      hovertemplate: "OTU ID: %{y}<br>Sample Value: %{x}<br>%{text}",
      marker: {
        color: "rgb(58, 200, 225)"
      },
      width: 0.8
    };
    
    // Layout for bar chart
    var barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Value" },
      yaxis: {
        title: "OTU ID",
        showticklabels: true,
        type: "category",
        automargin: true
      },
      margin: { t: 30, l: 150 }
    };

    // Create the bubble chart
    var bubbleTrace = {
      type: "scatter",
      mode:"markers",
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      hovertemplate: "OTU ID: %{x}<br>Sample Value: %{y}<br>%{text}",
      marker: {
        size: sampleValues.map(value => value/3),
        sizemode:"diameter",
        sizeref: 0.5,
        color: otuIds,
        colorscale: "Viridis"
      }
    };
    
    // Layout for bubble chart
    var bubbleLayout = {
      title: "All OTUs for Selected Individual",
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Sample Value"},
      margin: { t: 30, l: 150 }
    };
    
    // Create both charts
    var barChartData = [barTrace];
    var bubbleChartData = [bubbleTrace];
    Plotly.newPlot("bar", barChartData, barLayout);
    Plotly.newPlot("bubble", bubbleChartData, bubbleLayout);

    // Get metadata for the selected individual
    var metadata = data.metadata.find(function(meta) {
      return meta.id.toString() === selectedName;
    });

    // Display demographic metadata
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.html("");

    Object.entries(metadata).forEach(function([key, value]) {
      demographicInfo.append("p").text(`${key}: ${value}`);
    });
  }
    
  // Initialize the page with the first name in the dropdown
  optionChanged(names[0]);
});
