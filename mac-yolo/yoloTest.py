# Ultralytics 🚀 AGPL-3.0 License - https://ultralytics.com/license

import argparse

import cv2.dnn
import numpy as np

from ultralytics.utils import ASSETS, yaml_load
from ultralytics.utils.checks import check_yaml

CLASSES = yaml_load(check_yaml("data.yaml"))["names"]
colors = np.random.uniform(0, 255, size=(len(CLASSES), 3))


def draw_bounding_box(img, class_id, confidence, x, y, x_plus_w, y_plus_h):
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
    """
    label = f"{CLASSES[class_id]} ({confidence:.2f})"
    print(label)
    color = colors[class_id]
    cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), color, 10)
    cv2.putText(img, label, (x - 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 10, color, 20)


def main(onnx_model, input_image):
    """
    Main function to load ONNX model, perform inference, draw bounding boxes, and display the output image.

    Args:
        onnx_model (str): Path to the ONNX model.
        input_image (str): Path to the input image.

    Returns:
        list: List of dictionaries containing detection information such as class_id, class_name, confidence, etc.
    """
    # Load the ONNX model
    model: cv2.dnn.Net = cv2.dnn.readNetFromONNX(onnx_model)
    cam = cv2.VideoCapture(0)
    while True:
        # Read the input image
        ret, original_image = cam.read()
        [height, width, _] = original_image.shape

        # Prepare a square image for inference
        length = max((height, width))
        image = np.zeros((length, length, 3), np.uint8)
        image[0:height, 0:width] = original_image

        # Calculate scale factor
        scale = length / 640

        # Preprocess the image and prepare blob for model
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

        detections = []

        # Iterate through NMS results to draw bounding boxes and labels
        for i in range(len(result_boxes)):
            index = result_boxes[i]
            box = boxes[index]
            detection = {
                "class_id": class_ids[index],
                "class_name": CLASSES[class_ids[index]],
                "confidence": scores[index],
                "box": box,
                "scale": scale,
            }
            detections.append(detection)
            if detection["confidence"] >=  0.2:
                draw_bounding_box(
                    original_image,
                    class_ids[index],
                    scores[index],
                    round(box[0] * scale),
                    round(box[1] * scale),
                    round((box[0] + box[2]) * scale),
                    round((box[1] + box[3]) * scale),
                )

                

        # Display the image with bounding boxes
        cv2.imshow("image", original_image)
        cv2.waitKey(1)
        



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="better_holes_weight.onnx", help="Input your ONNX model.")
    parser.add_argument("--img", default=str("hole.jpg"), help="Path to input image.")
    args = parser.parse_args()
    main(args.model, args.img)
