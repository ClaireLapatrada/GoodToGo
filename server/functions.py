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
            f"Return your assessment for the product like the following example, NOTHING MORE NOTHING LESS: "
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

def recommended_action(price="100"):
    try:
        # Open the images
        pil_image1 = PIL.Image.open("uploads/photo_1.jpg")
        pil_image2 = PIL.Image.open("uploads/photo_2.jpg")
        pil_image3 = PIL.Image.open("uploads/photo_3.jpg")
        pil_image4 = PIL.Image.open("uploads/photo_4.jpg")
        pil_image5 = PIL.Image.open("uploads/photo_5.jpg")

        # Configure the Gemini API with your key
        genai.configure(api_key="")

        prompt = (
            f"Analyze the following images and assess their physical condition based on visible wear, damage, or missing parts. "
            f"Estimate the current market value of the product, considering an original price of {price} for the following options:\n"
            f"- Resell to online platform (if value is 70% or more of the original price)\n"
            f"- Auction to marketplace (if value is between 50% and 70% of the original price)\n"
            f"- Go to SALE section (if value is between 10% and 50% of the original price)\n"
            f"- Send to recycle (if product looks recyclable and value is between 0% and 50%)\n\n"
            f"- Send to landfill (if value is 0 to 10%)\n\n"
            f"Return a string with the actions and their corresponding estimated values in the following format, NOTHING MORE NOTHING LESS:\n"
            f"1,<estimated_value>|2,<estimated_value>|3,<estimated_value>|4,<estimated_value>|5,<estimated_value>"
        )

        # Initialize the model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Generate the response
        response = model.generate_content([prompt, pil_image1, pil_image2, pil_image3, pil_image4, pil_image5])

        # Print and return the response
        return response.text.strip()  # Return the response text

    except Exception as e:
        return f"Error: Unable to recommend an action for the images. Details: {str(e)}"
    
def recommended_repair():
    try:
        # Open the images
        pil_image1 = PIL.Image.open("uploads/photo_1.jpg")
        pil_image2 = PIL.Image.open("uploads/photo_2.jpg")
        pil_image3 = PIL.Image.open("uploads/photo_3.jpg")
        pil_image4 = PIL.Image.open("uploads/photo_4.jpg")
        pil_image5 = PIL.Image.open("uploads/photo_5.jpg")

        # Configure the Gemini API with your key
        genai.configure(api_key="")

        prompt = (
            f"Analyze the following images and identify if repair is needed and if so, the repair actions needed to restore the product to a functional state. "
            f"Mention the repair actions in the order they should be performed, based on the visible issues in the images.\n\n"
            f"Return your recommended repair actions in the following format, NOTHING MORE NOTHING LESS:\n"
            f"YES,<your explanation>\n OR"
            f"NO,<your explanation>\n"
        )

        # Initialize the model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Generate the response
        response = model.generate_content([prompt, pil_image1, pil_image2, pil_image3, pil_image4, pil_image5])

        # Print and return the response
        return response.text.strip()  # Return the response text

    except Exception as e:
        return f"Error: Unable to recommend a repair action for the images. Details: {str(e)}"