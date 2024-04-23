import { useRef, useState } from "react";

const LayerOption = (props) => {
    const [hovered, setHovered] = useState(false);
    
    return(
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => props.setValue(props.value)}
            style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                backgroundColor: props.selected ? "#FF0000" : "#222222",
                cursor: "pointer",
            }}
        >
            {hovered && <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.2)" 
            }} />}
            <span style={{ color: "#FFFFFF" }}>{props.value}</span>
        </div>
    )
}

const LayerArrow = (props) => (
    <div
        onClick={props.onClick}
        style={{
            // border: "1px solid #888888"
            height: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
        }}
    >
        <span style={{ color: "#888888", fontSize: 12, }}>{props.value}</span>
    </div>
)

const LayerSelection = (props) => {
    const innerContainerRef = useRef();
    const delta = 100;
    
    return (
        <div style={{
                position: "absolute",
                right: 16,
                bottom: 16,
                width: 40,
                borderRadius: 8,
                border: "1px solid #888888",
            }}
        >
            <LayerArrow 
                value="&#x25B2;"
                onClick={() => innerContainerRef.current.scrollTo({ 
                    top: innerContainerRef.current.scrollTop - delta,
                    behavior: "smooth"
                })}
            />
            <div 
                ref={innerContainerRef}
                style={{
                    maxHeight: 500,
                    overflow: "hidden",
                    borderTop: "1px solid #888888",
                    borderBottom: "1px solid #888888",
                    backgroundColor: "#222222",
                    boxShadow: "0px 0px 8px 4px rgba(0,0,0,0.2)"
                }}
            >
                {
                    Array(20).fill().map((_, index) => (
                        <LayerOption 
                            key={index.toString()}
                            value={index}
                            setValue={props.setValue}
                            selected={props.value === index}
                        />
                    ))
                }
            </div>
            <LayerArrow 
                value="&#x25BC;"
                onClick={() => innerContainerRef.current.scrollTo({ 
                    top: innerContainerRef.current.scrollTop + delta,
                    behavior: "smooth"
                })}
            />
        </div>
    )
}

export default LayerSelection;