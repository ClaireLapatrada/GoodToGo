import argparse
import cv2
import cv2.dnn
import numpy as np
import os

from ultralytics.utils import ASSETS, yaml_load
from ultralytics.utils.checks import check_yaml


model_dict = {}
class_dict = {}

def draw_bounding_box(img, class_id, confidence, x, y, x_plus_w, y_plus_h, classes):
    """
    Draws bounding boxes on the input image based on the provided arguments.

    Args:
        img (numpy.ndarray): The input image to draw the bounding box on.
        class_id (int): Class ID of the detected object.
        confidence (float): Confidence score of the detected object.
        x (int): X-coordinate of the top-left corner of the bounding box.
        y (int): Y-coordinate of the top-left corner of the bounding box.
        x_plus_w (int): X-coordinate of the bottom-right corner of the bounding box.
        y_plus_h (int): Y-coordinate of the bottom-right corner of the bounding box.
        classes: the list of classes?
    """
    colors = np.random.uniform(0, 255, size=(len(class_dict["model1"]), 3))  # Adjust color size to fit all class names
   
    label = f"{classes[class_id]} ({confidence:.2f})"
    print(label)
    color = colors[class_id]
    cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), color, 2)
    cv2.putText(img, label, (x - 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 5, color, 5)

def add_model(model_name: str, model_path: str, class_path: str):
    """
    Loads a model and class names and stores them in the dictionaries.
    """
    model_dict[model_name] = cv2.dnn.readNetFromONNX(model_path)
    class_dict[model_name] = yaml_load(check_yaml(class_path))["names"]

def detect_defects(models, input_images, file_path):
    """
    Main function to load ONNX models, perform inference, draw bounding boxes, and display the output image.

    Args:
        models (list): List of models initialized as OpenCV dnn objects.
        input_images list[str]: list of paths to the image
        file_path (str): the designated folder for the image to be saved.
    """
    
    for image_path in input_images:
        # Read the input image
        original_image = cv2.imread(image_path)
        [height, width, _] = original_image.shape

        # Prepare a square image for inference
        length = max((height, width))
        image = np.zeros((length, length, 3), np.uint8)
        image[0:height, 0:width] = original_image

        # Calculate scale factor
        scale = length / 640

        # Perform inference for all models
        detections = []
        for model_name, model in models.items():
            blob = cv2.dnn.blobFromImage(image, scalefactor=1 / 255, size=(640, 640), swapRB=True)
            model.setInput(blob)

            # Perform inference
            outputs = model.forward()

            # Prepare output array
            outputs = np.array([cv2.transpose(outputs[0])])
            rows = outputs.shape[1]

            boxes = []
            scores = []
            class_ids = []

            # Iterate through output to collect bounding boxes, confidence scores, and class IDs
            for i in range(rows):
                classes_scores = outputs[0][i][4:]
                (minScore, maxScore, minClassLoc, (x, maxClassIndex)) = cv2.minMaxLoc(classes_scores)
                if maxScore >= 0.25:
                    box = [
                        outputs[0][i][0] - (0.5 * outputs[0][i][2]),
                        outputs[0][i][1] - (0.5 * outputs[0][i][3]),
                        outputs[0][i][2],
                        outputs[0][i][3],
                    ]
                    boxes.append(box)
                    scores.append(maxScore)
                    class_ids.append(maxClassIndex)

            # Apply NMS (Non-maximum suppression)
            result_boxes = cv2.dnn.NMSBoxes(boxes, scores, 0.25, 0.45, 0.5)

            # Iterate through NMS results to draw bounding boxes and labels
            for i in range(len(result_boxes)):
                index = result_boxes[i]
                box = boxes[index]
                detection = {
                    "model": model_name,
                    "class_id": class_ids[index],
                    "class_name": class_dict[model_name][class_ids[index]],
                    "confidence": scores[index],
                    "box": box,
                    "scale": scale,
                }
                detections.append(detection)
                if detection["confidence"] >=  0.3:
                    draw_bounding_box(
                        original_image,
                        class_ids[index],
                        scores[index],
                        round(box[0] * scale),
                        round(box[1] * scale),
                        round((box[0] + box[2]) * scale),
                        round((box[1] + box[3]) * scale),
                        class_dict[model_name]
                    )

            # Display the image with bounding boxes
            print(file_path)
            print(image_path)
            writeStatus = cv2.imwrite(os.path.join(file_path , image_path), original_image)
            if writeStatus is True:
                print("image written")
            else:
                print("problem") # or raise exception, handle problem, etc.

if __name__ == "__main__":
    # Define models and their corresponding class YAMLs
    models = {
        "model1": {
            "weights": "yoloResources/holes.onnx",
            "classes": "yoloResources/clothingDefect.yaml"
        },
        "model2": {
            "weights": "yoloResources/stainDetectorFR.onnx",
            "classes": "yoloResources/stains.yaml"
        }
    }

    # Load all models
    for model_name, paths in models.items():
        add_model(model_name, paths["weights"], paths["classes"])

    detect_defects(model_dict, ["uploads/photo_1.jpg"], "" )
