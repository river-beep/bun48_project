let bun;

//SETTINGS BUTTONS
let customColorPicker;
let staticTextInput, staticTextInputButton, staticTextLabel;
let changingTextInput, changingtextInputButton, changingTextLabel;
let buttonStatic, buttonChanging, buttonDensity;
let backImageCheckbox, pixelPerfectCheckbox;
let colorModeDropdown;


//LOGIC
let current_char = 0; // Caractere atual do texto
const wait_time = 250; // Tempo para mudar o caractere (milisegundos)



//SETTINGS
//TEXT
let static_text = "*";
let changing_text = "Love"; //Texto que vai rolar na imagem
let density = "Ñ@#W9876543210?1abc;:+=-,._"; //Adicionar padrões de densidade depois.



//IMAGE
let imageType = "Changing";
let backImage = false;
let backImagePixelPerfect = false;
let customColor = [0, 255, 0];
let textColorMode = "D"; //D=Default || G=Grayscale || C=Custom

function preload() {
  bun = loadImage("bun48.png");
}

function setup() {
  canvas = createCanvas(800, 800);
  canvas.position(550, 50)
  canvas.parent("canvas-container");
  setTimeout(increase_char, wait_time);
  
  buttonStatic = createButton('Static');
  buttonStatic.position(canvas.x, canvas.y + canvas.height + 10);
  buttonStatic.mousePressed(() => imageType = "Static");
  
  buttonChanging = createButton('Changing');
  buttonChanging.position(canvas.x + 70, canvas.y + canvas.height + 10);
  buttonChanging.mousePressed(() => imageType = "Changing");

  buttonDensity = createButton('Density');
  buttonDensity.position(canvas.x + 155, canvas.y + canvas.height + 10);
  buttonDensity.mousePressed(() => imageType = "Density");
  
  backImageCheckbox = createCheckbox('Back Image', false);
  backImageCheckbox.position(canvas.x + 250, canvas.y + canvas.height + 7);
  backImageCheckbox.changed(back_image_checkbox);
  
  pixelPerfectCheckbox = createCheckbox("Pixel Perfect", false);
  pixelPerfectCheckbox.position(canvas.x + 350 , canvas.y + canvas.height + 7);
  pixelPerfectCheckbox.changed(() => backImagePixelPerfect = pixelPerfectCheckbox.checked()) 

  staticTextInput = createInput("★");
  staticTextInput.position(canvas.x  , canvas.y + canvas.height + 60)
  staticTextInput.attribute("maxlength", 12);

  staticTextInputButton = createButton("Update");
  staticTextInputButton.position(staticTextInput.x + staticTextInput.width + 10, staticTextInput.y)
  staticTextInputButton.mousePressed(update_texts)
    
  staticTextLabel = createP("Static Text")
  staticTextLabel.position(staticTextInput.x , staticTextInput.y - 30)
  
  changingTextInput = createInput("Love")
  changingTextInput.position(canvas.x + 225, canvas.y + canvas.height + 60)
  changingTextInput.attribute("maxlength", 48)
  
  changingTextInputButton = createButton("Update");
  changingTextInputButton.position(changingTextInput.x + changingTextInput.width + 10, changingTextInput.y)
  changingTextInputButton.mousePressed(update_texts)
  
  changingTextInputLabel = createP("Changing Text");
  changingTextInputLabel.position(changingTextInput.x, changingTextInput.y - 30)

  colorModeDropdown = createSelect()
  colorModeDropdown.position(canvas.x, canvas.y + canvas.height + 100)
  colorModeDropdown.option("Color Mode")
  colorModeDropdown.option("Grayscale", "G")
  colorModeDropdown.option("Default Colors", "D")
  colorModeDropdown.option("Custom Color", "C")
  colorModeDropdown.disable("Color Mode")
  colorModeDropdown.selected("Color Mode")
  colorModeDropdown.changed(updateMode)

  customColorPicker = createColorPicker("black")
  customColorPicker.position(canvas.x + 150, canvas.y + canvas.height + 100)
  customColorPicker.input(updateCustomColor)

}

function update_texts() {
  
  static_text = staticTextInput.value();
  changing_text = changingTextInput.value();
  
  
}

function updateMode() {
  textColorMode = colorModeDropdown.value()
}

function updateCustomColor() {
  let cHex = customColorPicker.value()
  let cRGB = hexToRgb(cHex)
 
  customColor[0] = cRGB.r
  customColor[1] = cRGB.g
  customColor[2] = cRGB.b
}

function hexToRgb(hex) {
  // Remove o # se existir
  hex = hex.replace('#', '');
  
  // Converter para valores RGB
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  
  return { r: r, g: g, b: b };

}


function color_mode() {
  if (grayScaleCheckbox.checked() == true) {
    textColorMode = "G";
    if (defaultColorCheckbox.checked() == true) {
      defaultColorCheckbox.checked(false);
      
    }
  }
  
  else if (defaultColorCheckbox.checked() == true) {
    textColorMode = "D";
    if (grayScaleCheckbox.checked() == true) {
      grayScaleCheckbox.checked(false); 
    }
  
  }
  
  else if (grayScaleCheckbox.checked() == false && defaultColorCheckbox.checked() == false) {
    textColorMode = "C"
  }
}




function back_image_checkbox() {
  backImage = backImageCheckbox.checked()
}


function increase_char() {
  current_char += 1;
  setTimeout(increase_char, wait_time);
  if (current_char > changing_text.length - 1) {
    current_char = 0;
  }
}

function draw() {
  background(0);

  let w = width / bun.width;
  let h = height / bun.height;

  bun.loadPixels();

  // Desenhar a imagem de fundo
  if (backImage == true) {
    if (backImagePixelPerfect == false) {
      image(bun, 0, 0, width, height);
    } else if (backImagePixelPerfect == true) {
      for (let j = 0; j < bun.height; j++) {
        for (let i = 0; i < bun.width; i++) {
          const pixelIndex = (i + j * bun.width) * 4; // Índice do pixel
          const r = bun.pixels[pixelIndex + 0];
          const g = bun.pixels[pixelIndex + 1];
          const b = bun.pixels[pixelIndex + 2];
          const a = bun.pixels[pixelIndex + 3];

          // Apenas desenhe se a opacidade (alpha) do pixel for maior que 0
          if (a > 0) {
            fill(r, g, b); // Cor do pixel
            noStroke();
            square(i * w, j * h, w); // Desenhar quadrado na posição correta
          }
        }
      }
    }
  }

  // Agora, desenhe o texto
  for (let j = 0; j < bun.height; j++) {
    for (let i = 0; i < bun.width; i++) {
      const pixelIndex = (i + j * bun.width) * 4;
      const r = bun.pixels[pixelIndex + 0];
      const g = bun.pixels[pixelIndex + 1];
      const b = bun.pixels[pixelIndex + 2];

      const avg = (r + g + b) / 3;

      // Definindo a cor do texto com base no modo de cor selecionado
      if (textColorMode == "G") {
        fill(avg);
      } else if (textColorMode == "D") {
        fill(r * 2, g * 2, b * 2);
      } else if (textColorMode == "C") {
        fill(customColor[0], customColor[1], customColor[2], avg);
      }

      noStroke();

      // Desenhar texto de acordo com o tipo de imagem
      textSize(w);
      textAlign(CENTER, CENTER);
      if (imageType == "Static") {
        text(static_text, i * w + w * 0.5, j * h + h * 0.5);
      } else if (imageType == "Changing") {
        text(changing_text.charAt(0 + current_char), i * w + w * 0.5, j * h + h * 0.5);
      } else if (imageType == "Density") {
        const len = density.length;
        const charIndex = floor(map(avg, 0, 255, len, 0));
        text(density.charAt(charIndex), i * w + w * 0.5, j * h + h * 0.5);
      }
    }
  }
}
