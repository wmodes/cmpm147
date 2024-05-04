/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "Lunch atop a Skyscraper", 
      assetUrl: "img/lunch-on-a-skyscraper.jpg",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
    },
    {
      name: "Train Wreck", 
      assetUrl: "img/train-wreck.jpg",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
    },
    {
      name: "Migrant mother", 
      assetUrl: "img/migrant-mother.jpg",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
    },
    {
      name: "Disaster Girl", 
      assetUrl: "img/girl-with-fire.jpg",
      credit: "Four-year-old Zoë Roth, 2005"
    },
  ];
}

function initDesign(inspiration) {
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width() - 80; // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  return {};
}

function renderDesign(design, inspiration) {}

function mutateDesign(design, inspiration, rate) {}
