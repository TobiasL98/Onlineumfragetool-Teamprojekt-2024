import Konva from "konva";
import {Circle, Group, Path, Rect, Text } from "react-konva";
import {useEffect, useRef, useState } from "react";

import { restrictPoints } from "../utils/guideLineUtils";
import { ICheckout } from "interfaces/edit/ICheckout";
import { EditorModes } from "lib/edit/EditorModes";
import { KonvaEventObject } from "konva/lib/Node";


interface CanvasCheckoutProps {
    checkout: ICheckout;
    scale: number;
    onDelete?: (checkout: ICheckout) => void;
    onClick?: (evt: KonvaEventObject<MouseEvent>, checkout: ICheckout) => void;
    onChange: (checkout: ICheckout) => void;
    mode: EditorModes;
}

export default function CanvasCheckout({ checkout, scale, onDelete = () => { return }, onChange, mode, onClick}: CanvasCheckoutProps) {
    const draggable = mode === EditorModes.checkouts;
    const textRef = useRef <Konva.Text | null>(null);
    const iconRef = useRef<Konva.Group | null>(null);
    const pathRef = useRef<Konva.Path | null>(null);
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [iconWidth, setRefreshIconWidth] = useState(0);
    const [iconHeight, setRefreshIconHeight] = useState(0);
    const [hover, setHover] = useState(false);
    const highlighted =  (mode === EditorModes.checkouts) ||  ((mode === EditorModes.image)  && hover == true);

    useEffect(() => {
        if (checkout.polygon.rotation === undefined) {
            checkout.polygon.rotation = 0;
            onChange(checkout);
        }
    }, [checkout, onChange]);

    useEffect(() => {
        if (pathRef.current) {
            const bbox = pathRef.current.getClientRect();
            setRefreshIconWidth(bbox.width);
            setRefreshIconHeight(bbox.height);
        }
    }, []);

    const handleRotateStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;
    }

    const handleRotateMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;

        const icon = e.target as Konva.Group;
        const stage = icon.getStage();

        if (!stage) return;

        const checkoutRect = icon.getParent()!.getChildren().find(child => child.name() === checkout.name);
        const mousePos = stage.getPointerPosition();

        if (!mousePos || !checkoutRect) return;

        checkoutRect.id(checkout.id)

        const dx = mousePos.x - checkoutRect.x();
        const dy = mousePos.y - checkoutRect.y();
        const newRotation = Math.atan2(dy, dx) * 180 / Math.PI;

        checkout.polygon.rotation = newRotation;
        checkoutRect.rotation(newRotation);

        if (iconRef.current) {
            iconRef.current.position({
                x: checkout.polygon.x,
                y: checkout.polygon.y
            });
            iconRef.current.rotation(newRotation);
            iconRef.current.offsetX(- checkout.polygon.width / 2 + iconWidth);
            iconRef.current.offsetY(iconHeight * 2);
        }

        if (textRef.current) {
            textRef.current.rotation(newRotation);
        }

        const textX = checkout.polygon.x
        const textY = checkout.polygon.y
        checkout.textPosition = { x: textX, y: textY};


        console.log("textPosition: ", checkout.textPosition)
      /*
       //const centerX = checkoutRect.x()
        //const centerY = checkoutRect.y()
        //const dx = mousePos.x - centerX;
        //const dy = mousePos.y - centerY;

      if (checkoutRect.offsetX() === 0) {
            const offsetX = checkout.polygon.width / 2;
            const offsetY = checkout.polygon.height / 2;

            checkoutRect.offsetX(offsetX);
            checkoutRect.offsetY(offsetY);

            checkoutRect.x(checkout.polygon.x + offsetX);
            checkoutRect.y(checkout.polygon.y + offsetY);
        }

        const offsetX = checkout.polygon.width / 2;
        const offsetY = checkout.polygon.height / 2;
        const radius = checkoutRect.height() / 2
        const angleInRadians = Konva.Util.degToRad(newRotation - 90);

        const rotatedIconX = centerX + radius * Math.cos(angleInRadians);
        const rotatedIconY = centerY +  radius * Math.sin(angleInRadians);

        if (iconRef.current) {
            iconRef.current.offsetX(iconWidth)
            iconRef.current.offsetY(iconHeight * 2)
            iconRef.current.position({
                x: rotatedIconX,
                y: rotatedIconY
            });
            iconRef.current.rotation(newRotation);
        }

        if (textRef.current && checkout.textPosition) {
            const textPositionX = checkout.polygon.x
            const textPositionY = checkout.polygon.y
            checkout.textPosition = { x: textPositionX, y: textPositionY };
            textRef.current.position(checkout.textPosition);
            textRef.current.rotation(newRotation)
        }*/

         onChange(checkout);
    };

    /*const handleRotateEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        const icon = e.target as Konva.Group;
        const checkoutRect = icon.getParent()!.getChildren().find(child => child.name() === checkout.name);
        if (checkoutRect && checkoutRect.offsetX() !== 0) {

            //checkout.polygon.x = checkoutRect.x()
           // checkout.polygon.y = checkoutRect.y()

            checkoutRect.offsetX(0);
            checkoutRect.offsetY(0);

           /* const offsetX = checkout.polygon.width / 2;
            const offsetY = checkout.polygon.height  / 2;

            const angleInRadians = checkoutRect.rotation() * Math.PI / 180;
            const cosTheta = Math.cos(angleInRadians);
            const sinTheta = Math.sin(angleInRadians);
            const newX = checkoutRect.x() - offsetX * cosTheta + offsetY * sinTheta;
            const newY = checkoutRect.y() - offsetX * sinTheta - offsetY * cosTheta;

            checkoutRect.x(newX )//- offsetX);
            checkoutRect.y(newY)// - offsetY);

            checkoutRect.offsetX(0);
            checkoutRect.offsetY(0);

            console.log("newX: " + newX, "newY: " + newY)
            console.log("checkout.polygon.x: " + checkout.polygon.x, "checkout.polygon.y: " + checkout.polygon.y)
            console.log("checkoutRect.x: " + checkoutRect.x(), "checkoutRect.y: " + checkoutRect.y())

            const newIconX = icon.x() - iconWidth * cosTheta + iconHeight * 2 * sinTheta
            const newIconY = icon.y() - iconWidth * sinTheta - iconHeight * 2 * cosTheta

            if (icon) {
               icon.x(newIconX);
               icon.y(newIconY);

                icon.offsetX(0);
                icon.offsetY(0);
            }

            //checkout.polygon.x = newX
            //checkout.polygon.y = newY

            console.log("textref  " + textRef.current!.x() + " " + textRef.current!.y() + "textposition"+ checkout.textPosition!.x + " " + checkout.textPosition!.y)
            //checkout.textPosition = { x: newX, y: newY };*/
       // }
  //  }

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        const initPos = e.target.getPosition();
        setInitialPosition(initPos);
    }

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        const checkoutRect = e.target as Konva.Rect;
        const stage = checkoutRect.getStage();

        if (!stage) return;

        const { restrictedPointX, restrictedPointY } = restrictPoints({ ev: e, initialPosition });

        checkout.polygon.x = restrictedPointX;
        checkout.polygon.y = restrictedPointY;

        const radius = checkoutRect.height() / 2
        const angleInRadians = Konva.Util.degToRad(checkoutRect.rotation() - 90);
        const cosTheta = Math.cos(angleInRadians);
        const sinTheta = Math.sin(angleInRadians);

        let centerX: number
        let centerY: number

        if (checkout.polygon.rotation === 0) {
            centerX = checkout.polygon.x + checkout.polygon.width;
            centerY = checkout.polygon.y

            const rotatedCircleX = centerX + radius * cosTheta;
            const rotatedCircleY = centerY + radius * sinTheta;

            if (iconRef.current) {
                iconRef.current.position({
                    x: rotatedCircleX - checkout.polygon.width / 2 - iconWidth,
                    y: rotatedCircleY + checkout.polygon.height / 2 - iconHeight *2,
                });
                iconRef.current.rotation(checkout.polygon.rotation!)
            }
        } else {
            if (iconRef.current) {
                // offset changes position icon after drag
                   // iconRef.current.offsetX(0);
                   // iconRef.current.offsetX(0);

                // when dragged (works with below)
                iconRef.current.position({
                    x: restrictedPointX,
                    y: restrictedPointY
                });
                iconRef.current.rotation(checkout.polygon.rotation!);
            }

        }
        checkout.textPosition = {x: restrictedPointX, y: restrictedPointY};

        if (textRef.current && checkout.textPosition) {
            textRef.current.position(checkout.textPosition);
        }

            /*const notRotatedCenterX = checkout.polygon.x  - checkout.polygon.width / 2;
            const notRotatedCenterY = checkout.polygon.y - checkout.polygon.height / 2;

            //const centerX = restrictedPointX + checkout.polygon.width / 2;
           // const centerY = restrictedPointY + checkout.polygon.height / 2;

            //const rotatedCenterX = centerX;
            //const rotatedCenterY = centerY;

            if (textRef.current && checkout.textPosition) {
                textRef.current.position({
                    x: notRotatedCenterX, //- textRef.current.width() / 2,
                    y: notRotatedCenterY  //- textRef.current.height() / 2
                });
            }
            checkout.textPosition = {
                x: notRotatedCenterX ,//- 40,
                y: notRotatedCenterY //+ 300 // + 300 had no effect lol ???
            };
        }*/

         onChange(checkout);
    };

    const handleHover = (enable: boolean) => {
        setHover(enable);
        onChange({ ...checkout, hover: enable });
    }

    return (
        <>
            <Rect
                {...checkout.polygon}
                name={checkout.id}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
                draggable={draggable}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                strokeWidth={2 / scale}
                stroke={highlighted ? "orange" : "white"}
                dash={[5, 5]}
                onClick={(e) => {
                    if (e.evt.button !== 2 && onClick) {
                        onClick(e, checkout);
                    }
                }}
                fill={highlighted ? "rgba(255, 165, 0, 0.7)" : "rgba(128, 128, 128, 0.5)"}
                onContextMenu={(e) => {
                    e.evt.preventDefault();
                    onDelete(checkout);
                }}
            />
            {mode === EditorModes.checkouts && (
                <Group
                    ref={iconRef}
                    x={checkout.polygon.x + checkout.polygon.width / 2 - iconWidth}
                    y={checkout.polygon.y - iconHeight * 2}
                    draggable
                    dragOnTop={false}
                    onDragStart={handleRotateStart}
                    onDragMove={handleRotateMove}
                    //onDragEnd={handleRotateEnd}
                >
                    <Path
                        ref={pathRef}
                        data="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-0.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14 0.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                        fill="white"
                        strokeWidth={2}
                    />
                </Group>
            )}
            <Text
                ref={textRef}
                x={checkout.polygon.x}
                y={checkout.polygon.y}
                text={checkout.text}
                fontSize={14}
                fill='white'
                align='center'
                verticalAlign='middle'
                width={checkout.polygon.width}
                height={checkout.polygon.height}
                listening={false}
                rotation={checkout.polygon.rotation}
            />
            {mode === EditorModes.image && checkout.shoppingOrder !== undefined  && (
                <Text
                    rotation={checkout.polygon.rotation}
                    ref={textRef}
                    x={checkout.polygon.x}/// - 20 * Math.cos(Konva.Util.degToRad(checkout.polygon.rotation! - 90))}
                    y={checkout.polygon.y}// + 20 * Math.sin(Konva.Util.degToRad(checkout.polygon.rotation! - 90))}
                    text={`${checkout.shoppingOrder}.`}
                    fontSize={14}
                    fill={highlighted ? "white" : "orange"}
                    //align='center'
                    //verticalAlign='middle'
                    padding={7}
                    width={checkout.polygon.width}
                    height={checkout.polygon.height}
                    listening={false}
                />
            )}
        </>
    );
}