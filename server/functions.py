import google.generativeai as genai
import pathlib
import PIL.Image

# Set up Gemini API Key (configure it correctly)
def condition_grading(price="100"):
    try:
        # Open the images
        pil_image1 = PIL.Image.open("uploads/photo_1.jpg")
        pil_image2 = PIL.Image.open("uploads/photo_2.jpg")
        pil_image3 = PIL.Image.open("uploads/photo_3.jpg")
        pil_image4 = PIL.Image.open("uploads/photo_4.jpg")
        pil_image5 = PIL.Image.open("uploads/photo_5.jpg")

        # Configure the Gemini API with your key
        genai.configure(api_key="")

        # Define the prompt
        prompt = (
            f"Analyze the following images and assess their physical condition based on visible wear, damage, or missing parts. "
            f"Classify the product as a whole into one of the following categories: Salvage, Fair, Used - Good, or Used - Like New. "
            f"Justify your classification based on the visible features across all images.\n\n"
            f"Additionally, estimate the current market value of the product, considering an original price of {price}.\n\n"
            f"Return your assessment for the product like the following example, nothing more, nothing less: "
            f"Used - Like New,99"
        )

        # Initialize the model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Generate the response
        response = model.generate_content([prompt, pil_image1, pil_image2, pil_image3, pil_image4, pil_image5])

        # Print and return the response
        return response.text.strip()  # Return the response text

    except Exception as e:
        return f"Error: Unable to grade the images. Details: {str(e)}"