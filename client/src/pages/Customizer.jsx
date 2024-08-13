import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import * as dotenv from 'dotenv';

const Customizer = () => {
  const snap = useSnapshot(state)
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })

  const canvasRef = useRef(null);
  dotenv.config();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const gl = canvas.getContext('webgl');
      
      if (gl) {
        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
      }

      return () => {
        if (canvas) {
          canvas.removeEventListener('webglcontextlost', handleContextLost);
          canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        }
      };
    }
  }, []);

  const handleContextLost = (event) => {
    event.preventDefault(); // Prevent the default behavior of WebGL context loss
    alert('WebGL context lost. Please try reloading the page or adjusting your design to be less resource-intensive.');
  };

  const handleContextRestored = () => {
    // Optionally, you can implement logic to try and restore the context or reload the assets
    alert('WebGL context restored. You may continue with your design.');
  };

  const handleDownload = () => {
    downloadCanvasToImage();  
  };

  const handleClick = (tabName) => {
    if (activeEditorTab === tabName) {
      setActiveEditorTab("");
    } else {
      setActiveEditorTab(tabName); 
    }
  }

  const generateTabContent = () => {
    if (!activeEditorTab) return null;

    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
        file={file}
        setFile={setFile}
        readFile={readFile}
        />
      case "aipicker":
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");
    try {
      setGeneratingImg(true);

        const response = await fetch(`${REACT_APP_BACKEND_URL}api/sdiffusion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "inputs":prompt,
        })
      })

      let blob = await response.blob();
      {
        if (blob.type === 'application/octet-stream') {
            blob = blob.slice(0, blob.size, 'image/png');
        }
      }
    
    const base64data = await blobToBase64(blob);
    const img = document.createElement('img');
    img.src = base64data;
    handleDecals(type, img.src)
      
    } catch(error) { alert(error)}
    finally {
      setGeneratingImg(false)
      setActiveEditorTab("")
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  }
  

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => handleClick(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
            
            <div
              className={`tab-btn rounded-full border border-lime-600`}
              onClick={downloadCanvasToImage}
            >
              <img 
                src={download}
                alt="Download"
                className={`w-2/3 h-2/3`}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Customizer



