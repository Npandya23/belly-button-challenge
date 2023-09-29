//  url is called using the d3 library for fetching the data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  //  for each data and option element is added from the fetched data with the corresponding name and property value
  data.names.forEach((name) => {
    d3.select("#selDataset")
      .append("option")
      .text(name)
      .property("value", name);
  });

  //  optionChanged function is populated with the first element of the data
  optionChanged(data.names[0]);
});

function optionChanged(sample) {
  //  again data is fetched from the samples.json whenever 
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    //  the data values for that particular sample is stored in the dataValues variable
    let dataValues = data.samples.filter((e) => e.id === sample)[0];
    //  the top 10 values are reversed
    let reverseValues = dataValues.sample_values.slice(0, 10).reverse();
    //  the otu ids for all of the 10 values is stored as labels in the reversed format
    let Ids = dataValues.otu_ids
      .slice(0, 10)
      .map((id) => `OTU ${id}`)
      .reverse();
    let labels = dataValues.otu_labels.slice(0, 10).reverse();

    //  build the bar chart with the values of the top 10 otu ids for the seleceted sample
    let trace = {
      x: reverseValues,
      y: Ids,
      text: labels,
      type: "bar",
      orientation: "h",
      marker: {
        color: "#4188ff",
      },
    };

    Plotly.newPlot("bar", [trace]);

    //  create a bubble chart for the same
    let bubbleTrace = {
      x: dataValues.otu_ids,
      y: dataValues.sample_values,
      mode: "markers",
      marker: {
        size: dataValues.sample_values,
        color: dataValues.otu_ids,
        colorscale: "Earth",
      },
      text: dataValues.otu_labels,
    };

    let bubbleLayout = {
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
    };

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    //  build up meta data for the same sample and fill in the the division with meta data
    let metadata = data.metadata.filter((m) => m.id.toString() === sample)[0];
    let mdDiv = d3.select("#sample-metadata");
    mdDiv.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      mdDiv.append("p").text(`${key}: ${value}`);
    });
  });
}
