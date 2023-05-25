// URL to the sample data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

  // Fetch the JSON data
d3.json(url).then(function(data) {

  // Retrieve the names array for dropdown options
  var names = data.names;

  // Populate the dropdown menu with names
  var dropdown = d3.select("#selDataset");
  names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });
      
  // Function to handle changes in the dropdown selection
  function optionChanged(selectedName) {
    // Filter the data for the selected individual
    var individualData = data.samples.find(function(sample) {
      return sample.id === selectedName;
    });
        
    // Activate function when dropdown changes
    dropdown.on("change", function() {
      var selectedName = dropdown.property("value");
      optionChanged(selectedName);
    });
    
    // Get the top 10 OTUs and corresponding values and labels
    var otuIds = individualData.otu_ids.slice(0, 10).map(String).reverse();
    var sampleValues = individualData.sample_values.slice(0, 10).reverse();
    var otuLabels = individualData.otu_labels.slice(0, 10).reverse();
    
    // Create the bar chart
    var trace = {
      type: "bar",
      orientation: "h",
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      hovertemplate: "OTU ID: %{y}<br>Sample Value: %{x}<br>%{text}<extra></extra>",
      marker: {
        color: "rgb(58, 200, 225)"
      },
      width: 0.8
    };
    
    var layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Value" },
      yaxis: {
        title: "OTU ID",
        showticklabels: true, // Show tick labels
        type: "category", // Set the Y-axis type to "category"
        automargin: true // Adjust the margins
      },
      margin: { t: 30, l: 150 }
    };
    
    var chartData = [trace];
    Plotly.newPlot("bar", chartData, layout);
  }
    
    // Initialize the page with the first name in the dropdown
  optionChanged(names[0]);
});
