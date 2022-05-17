# %% [markdown] {"id":"S5tsdtXpf1_R"}
# # Importing Basic Libraries

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:24:21.18396Z","iopub.execute_input":"2022-03-05T04:24:21.184908Z","iopub.status.idle":"2022-03-05T04:24:32.151773Z","shell.execute_reply.started":"2022-03-05T04:24:21.184808Z","shell.execute_reply":"2022-03-05T04:24:32.150741Z"}}
# !pip install easyocr

# %% [code] {"id":"f_Re3Os_e18D","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:32.154099Z","iopub.execute_input":"2022-03-05T04:24:32.154457Z","iopub.status.idle":"2022-03-05T04:24:43.586225Z","shell.execute_reply.started":"2022-03-05T04:24:32.15441Z","shell.execute_reply":"2022-03-05T04:24:43.585174Z"}}
import easyocr
import numpy as np
import pandas as pd
import cv2
import matplotlib.pyplot as plt
import matplotlib.image as img
from PIL import Image, ImageDraw,ImageFont
import sys 
import os
import random
import scipy
from tqdm import *
import os 
import pickle
from contextlib import closing
import multiprocessing as mp
import concurrent.futures
from skimage import data, img_as_float
from skimage.metrics import structural_similarity as ssim
from skimage.metrics import mean_squared_error,normalized_root_mse,peak_signal_noise_ratio

#%matplotlib inline
reader = easyocr.Reader(['en'])


# %% [markdown] {"id":"GCeUNBwogA9Q"}
# # Importing Keras for Deep Learning

# %% [code] {"id":"e-dttkPheuq2","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:43.589077Z","iopub.execute_input":"2022-03-05T04:24:43.58973Z","iopub.status.idle":"2022-03-05T04:24:49.532285Z","shell.execute_reply.started":"2022-03-05T04:24:43.589683Z","shell.execute_reply":"2022-03-05T04:24:49.531284Z"}}
from tensorflow import keras
from tensorflow.keras.callbacks import *
from tensorflow.keras.layers import *
from tensorflow.keras.models import *
from tensorflow.keras.preprocessing import image
from tensorflow.keras import initializers
import tensorflow.keras.backend as K
import tensorflow as tf

# %% [markdown] {"id":"cd-1Y47Jl26n"}
# # Loading the Dataset

# %% [code] {"id":"D_bfoV6nm_7t","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:49.534784Z","iopub.execute_input":"2022-03-05T04:24:49.535018Z","iopub.status.idle":"2022-03-05T04:24:49.542557Z","shell.execute_reply.started":"2022-03-05T04:24:49.534988Z","shell.execute_reply":"2022-03-05T04:24:49.537971Z"}}
path = "/content/drive/MyDrive/Sem 7/FYP/dataset"

# %% [code] {"id":"JC7DlFl5oTMN","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:49.548104Z","iopub.execute_input":"2022-03-05T04:24:49.548976Z","iopub.status.idle":"2022-03-05T04:24:49.562835Z","shell.execute_reply.started":"2022-03-05T04:24:49.548926Z","shell.execute_reply":"2022-03-05T04:24:49.561652Z"}}
def train_img(i):
    img_i = keras.preprocessing.image.load_img(
    os.path.join(path,i), grayscale=False, color_mode="rgb",target_size=(64,64), interpolation="nearest")
    x = keras.preprocessing.image.img_to_array(img_i)
    return x

def test_img(i):
    img_i = keras.preprocessing.image.load_img(
    os.path.join(path,i), grayscale=False, color_mode="rgb",target_size=(64,64), interpolation="nearest")
    x = keras.preprocessing.image.img_to_array(img_i)
    return x
 
def dataset_loader(train, path):

    total_imgs = np.array(os.listdir(path))
    np.random.shuffle(total_imgs)

    X_train = []
    X_test = []

    total_size = total_imgs.shape[0]
    train_set = round((train*total_size)/100)

    img_train = total_imgs[0:train_set]
    img_test = total_imgs[train_set:]

    with closing(mp.Pool()) as p:
        X_train = p.map(train_img,img_train)
        p.join()

    print("Training Dataset Created.")

    with closing(mp.Pool()) as p:
        X_test = p.map(test_img,img_test)
        p.join()

    print("Testing Dataset Created.")

    return (np.array(X_train),np.array(X_test))

# %% [code] {"executionInfo":{"elapsed":170258,"status":"ok","timestamp":1636272515785,"user":{"displayName":"Vikram Balaji","photoUrl":"https://lh3.googleusercontent.com/a-/AOh14GgiPTUPDjGVemUXMye7g-7mUYOLnptAlPzjHrRGmA=s64","userId":"11931188914811718127"},"user_tz":-330},"id":"RmCD9a891G_d","outputId":"8b8976f5-886c-4c89-fb36-73b235bf2955","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:49.564316Z","iopub.execute_input":"2022-03-05T04:24:49.564977Z","iopub.status.idle":"2022-03-05T04:24:49.576158Z","shell.execute_reply.started":"2022-03-05T04:24:49.564934Z","shell.execute_reply":"2022-03-05T04:24:49.575357Z"}}
# X_train, X_test = dataset_loader(70, path)
# np.save("/content/drive/MyDrive/X_train.npy",X_train)
# np.save("/content/drive/MyDrive/X_test.npy",X_test)

# %% [code] {"id":"mhYjcxXXHV2O","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:49.578064Z","iopub.execute_input":"2022-03-05T04:24:49.578483Z","iopub.status.idle":"2022-03-05T04:24:51.168589Z","shell.execute_reply.started":"2022-03-05T04:24:49.578441Z","shell.execute_reply":"2022-03-05T04:24:51.16729Z"}}
X_train = np.load("../input/skincancer/X_train.npy") 
X_test = np.load("../input/skincancer/X_test.npy")

# %% [code] {"id":"NoqI0m3RUtbR","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:51.170215Z","iopub.execute_input":"2022-03-05T04:24:51.170529Z","iopub.status.idle":"2022-03-05T04:24:51.271995Z","shell.execute_reply.started":"2022-03-05T04:24:51.170488Z","shell.execute_reply":"2022-03-05T04:24:51.270995Z"}}
def normalize(img):
    return img/255.0

def denormalize(img):
    return img*255.0

X_train = normalize(X_train)
X_test = normalize(X_test)

# %% [code] {"executionInfo":{"elapsed":515,"status":"ok","timestamp":1636274130070,"user":{"displayName":"Vikram Balaji","photoUrl":"https://lh3.googleusercontent.com/a-/AOh14GgiPTUPDjGVemUXMye7g-7mUYOLnptAlPzjHrRGmA=s64","userId":"11931188914811718127"},"user_tz":-330},"id":"RgxjviRMYW2M","outputId":"aba45acf-3c91-490f-99e5-cb623423f412","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:51.27381Z","iopub.execute_input":"2022-03-05T04:24:51.274185Z","iopub.status.idle":"2022-03-05T04:24:51.282999Z","shell.execute_reply.started":"2022-03-05T04:24:51.274117Z","shell.execute_reply":"2022-03-05T04:24:51.282014Z"}}
print ("Number of training examples = " + str(X_train.shape[0]))
print ("Number of test examples = " + str(X_test.shape[0]))
print ("X_train shape: " + str(X_train.shape))

# %% [code] {"id":"Jrycng5kX7xw","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:51.288936Z","iopub.execute_input":"2022-03-05T04:24:51.28977Z","iopub.status.idle":"2022-03-05T04:24:51.297449Z","shell.execute_reply.started":"2022-03-05T04:24:51.289734Z","shell.execute_reply":"2022-03-05T04:24:51.2963Z"}}
train_Secret = X_train[0:X_train.shape[0] // 2]
train_Cover = X_train[X_train.shape[0] // 2:]

# %% [code] {"executionInfo":{"elapsed":5316,"status":"ok","timestamp":1636274144066,"user":{"displayName":"Vikram Balaji","photoUrl":"https://lh3.googleusercontent.com/a-/AOh14GgiPTUPDjGVemUXMye7g-7mUYOLnptAlPzjHrRGmA=s64","userId":"11931188914811718127"},"user_tz":-330},"id":"R5JhplBlX_Sx","outputId":"d39ccec0-8387-4c14-be94-6b5e0098b531","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:51.299774Z","iopub.execute_input":"2022-03-05T04:24:51.300012Z","iopub.status.idle":"2022-03-05T04:24:53.61556Z","shell.execute_reply.started":"2022-03-05T04:24:51.299984Z","shell.execute_reply":"2022-03-05T04:24:53.614719Z"}}
def visualize_image(data,single_img = False,rows = 4, columns = 5):
    
    if single_img:
        plt.imshow(data)
    else:
        fig=plt.figure(figsize=(10, 10))
        for i in range(1, columns*rows +1):
            index = np.random.choice(data.shape[0])
            fig.add_subplot(rows, columns, i)
            plt.imshow(data[index])
        plt.show()
        
visualize_image(train_Secret,single_img = False)

# %% [markdown] {"id":"DH205Jr3ARnA"}
# # Loss Functions and Other Hyper Parameters

# %% [code] {"id":"kO_CuxdcHk_A","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:53.616764Z","iopub.execute_input":"2022-03-05T04:24:53.617536Z","iopub.status.idle":"2022-03-05T04:24:53.630485Z","shell.execute_reply.started":"2022-03-05T04:24:53.61748Z","shell.execute_reply":"2022-03-05T04:24:53.62933Z"}}
beta = 0.75

def reveal_loss(secret, secret_prime):
    return  beta * K.sum(K.square(secret - secret_prime)) +  tf.math.reduce_sum(1 - tf.image.ssim(secret, secret_prime,max_val = 1)).numpy()

# tf.math.reduce_sum(1 - tf.image.ssim(secret, secret_prime,max_val = 1)).numpy()

def model_loss(img_true, img_pred):
    secret, cover = img_true[:,:,:,0:3], img_true[:,:,:,3:6]
    secret_prime, cover_prime = img_pred[:,:,:,0:3], img_pred[:,:,:,3:6]
    
    secret_loss = beta * K.sum(K.square(secret - secret_prime)) +  tf.math.reduce_sum(1 - tf.image.ssim(secret, secret_prime,max_val = 1)).numpy()
    cover_loss = K.sum(K.square(cover - cover_prime))
    
    return secret_loss + cover_loss

# %% [markdown]
# # Training

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:24:53.632465Z","iopub.execute_input":"2022-03-05T04:24:53.633579Z","iopub.status.idle":"2022-03-05T04:24:53.645926Z","shell.execute_reply.started":"2022-03-05T04:24:53.633531Z","shell.execute_reply":"2022-03-05T04:24:53.644595Z"}}
def image_to_text(url):
    
    bounds = reader.readtext(url)
    return ''.join(word[1] for word in bounds)
    

def text_to_image(msg): 
    
    no_of_lines=len(msg.split('\n'))
    mylist=[]
    slist=msg.split('\n')
    
    for m in msg.split('\n'):
        mylist.append(len(m.split(' ')))
    
    myFont = ImageFont.truetype('../input/arial-font/arial.ttf', size=16)
    img = Image.new('RGB', (64,64), color = (194,27,49))
    
    d = ImageDraw.Draw(img)
    d.text((10,10),msg,fill=(89,12,22),font=myFont)
    
    return img

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:53.649058Z","iopub.execute_input":"2022-03-05T04:24:53.649497Z","iopub.status.idle":"2022-03-05T04:24:53.678651Z","shell.execute_reply.started":"2022-03-05T04:24:53.649438Z","shell.execute_reply":"2022-03-05T04:24:53.677428Z"}}
def stego_model(input_size):
    
    def img_encoder(input_size):

        secret_input_shape = Input(shape=(input_size))
        cover_input_shape = Input(shape=(input_size))
        
        # Feature Extraction Network
        
        x1 = Conv2D(50,(1, 1), strides = (1, 1), padding='same', activation='relu')(secret_input_shape)
        x3 = Conv2D(40, (3, 3), strides = (1, 1), padding='same', activation='relu')(secret_input_shape)
        x7 = Conv2D(30, (7, 7), strides = (1, 1), padding='same', activation='relu')(secret_input_shape)    
        
        x = concatenate([x1,x3,x7])
        
        x1 = Conv2D(50, (1, 1), strides = (1, 1), padding='same', activation='relu')(x)
        x3 = Conv2D(40, (3, 3), strides = (1, 1), padding='same', activation='relu')(x)
        x7 = Conv2D(30, (7, 7), strides = (1, 1), padding='same', activation='relu')(x)
        
        x = concatenate([x1,x3,x7])
        

        x = Conv2D(7, (2, 2), strides = (1, 1), padding='same', activation='tanh')(x)

        
        x = concatenate([cover_input_shape, x])

       # Hiding Network

        x = Conv2D(50, (4, 4), strides = (1, 1), padding='same', activation='relu')(x)
        x = Conv2D(50, (4, 4), strides = (1, 1), padding='same', activation='relu')(x)
        x = Conv2D(50, (4, 4), strides = (1, 1), padding='same', activation='relu')(x)
        x = Conv2D(50, (4, 4), strides = (1, 1), padding='same', activation='relu')(x)
        x = Conv2D(30, (2, 2), strides = (1, 1), padding='same', activation='relu')(x)

        cover_prime = Conv2D(3, (2, 2), strides = (1, 1), padding='same', activation='tanh')(x)


        return Model(inputs = [secret_input_shape, cover_input_shape],
                     outputs = cover_prime)

    def img_decoder(input_size):
        


        reveal_input_shape = Input(shape=(input_size))
        
        # Noise Layer

        noise_shape = GaussianNoise(0.01)(reveal_input_shape)
        
        # Secret Extraction Network 
        
        
        x7 = Conv2D(30, (7, 7), strides = (1, 1), padding='same', activation='relu')(noise_shape)
        x3 = Conv2D(40, (3, 3), strides = (1, 1), padding='same', activation='relu')(noise_shape)
        x1 = Conv2D(50, (1, 1), strides = (1, 1), padding='same', activation='relu')(noise_shape)
        
        x = concatenate([x7,x3,x1])
        
        
        x7 = Conv2D(30, (7, 7), strides = (1, 1), padding='same', activation='relu')(x)
        x3 = Conv2D(40, (3, 3), strides = (1, 1), padding='same', activation='relu')(x)
        x1 = Conv2D(50, (1, 1), strides = (1, 1), padding='same', activation='relu')(x)

        
        x = concatenate([x7,x3,x1])
        

        secret_prime = Conv2D(3, (2, 2), strides = (1, 1), padding='same', activation='tanh')(x)

        return Model(inputs = reveal_input_shape,
                       outputs = secret_prime)

  
    
    secret_input_shape = Input(shape=(input_size))
    cover_input_shape= Input(shape=(input_size))

    encrypter = img_encoder(input_size)
    decrypter = img_decoder(input_size)

    decrypter.compile(optimizer = tf.keras.optimizers.Adam(learning_rate = 0.001), loss=reveal_loss, run_eagerly = True)
    decrypter.trainable = False

    cover_prime = encrypter([secret_input_shape, cover_input_shape])
    secret_prime = decrypter(cover_prime)

    stego_system = Model(inputs = [secret_input_shape, cover_input_shape],
                        outputs = concatenate([secret_prime, cover_prime]))
    stego_system.compile(optimizer = tf.keras.optimizers.Adam(learning_rate = 0.001), loss = model_loss, run_eagerly = True)

    return encrypter, decrypter, stego_system

# %% [code] {"id":"-hTejekMJNek","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:53.680906Z","iopub.execute_input":"2022-03-05T04:24:53.681647Z","iopub.status.idle":"2022-03-05T04:24:56.685927Z","shell.execute_reply.started":"2022-03-05T04:24:53.681592Z","shell.execute_reply":"2022-03-05T04:24:56.684992Z"}}
encryption_model, decryption_model, stego_system = stego_model(train_Secret.shape[1:])

# %% [code] {"id":"l35gvnlxJPkG","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:56.687731Z","iopub.execute_input":"2022-03-05T04:24:56.688042Z","iopub.status.idle":"2022-03-05T04:24:56.694119Z","shell.execute_reply.started":"2022-03-05T04:24:56.687997Z","shell.execute_reply":"2022-03-05T04:24:56.693105Z"}}
def learning_rate_scheduler(epoch):
    if epoch < 200:
        return 0.001
    elif epoch < 400:
        return 0.0003
    else:
        return 0.0001

# %% [code] {"id":"OIK4XMO4JT0R","outputId":"b44707ce-290f-41d0-9c6e-fa6a81628bc8","jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:56.695923Z","iopub.execute_input":"2022-03-05T04:24:56.696547Z","iopub.status.idle":"2022-03-05T04:24:56.715221Z","shell.execute_reply.started":"2022-03-05T04:24:56.696502Z","shell.execute_reply":"2022-03-05T04:24:56.714196Z"}}
def train_model(epochs,batch_size,train_Secret,train_Cover):
    
    m = train_Secret.shape[0]
    loss_history_steg = []
    loss_history_decrypter = []

    for epoch in range(epochs):
        np.random.shuffle(train_Secret)
        np.random.shuffle(train_Cover)

        banner = tqdm(range(0, train_Secret.shape[0], batch_size),mininterval=0)

        st_loss = []
        d_loss = []

        for idx in banner:

            batch_Secret = train_Secret[idx:min(idx + batch_size, m)]
            batch_Cover = train_Cover[idx:min(idx + batch_size, m)]

            cover_prime = encryption_model.predict([batch_Secret, batch_Cover])
            
            st_loss.append(stego_system.train_on_batch(x=[batch_Secret, batch_Cover],
                                           y=np.concatenate((batch_Secret, batch_Cover),axis=3)))
            d_loss.append(decryption_model.train_on_batch(x=cover_prime,
                                      y=batch_Secret))
            

            K.set_value(stego_system.optimizer.lr, learning_rate_scheduler(epoch))
            K.set_value(decryption_model.optimizer.lr, learning_rate_scheduler(epoch))


            banner.set_description('Epoch {} | Batch: {:3} of {}. Stegosystem Loss{:10.2f} | Decrypter Loss {:10.2f}'.format(epoch + 1, idx, m, np.mean(st_loss), np.mean(d_loss)))
        
        if epoch == 149:
            encryption_model.save("encrypter_150.h5")
            decryption_model.save("decrypter_150.h5")
            stego_system.save("stego_150.h5")
        if epoch == 299:
            encryption_model.save("encrypter_300.h5")
            decryption_model.save("decrypter_300.h5")
            stego_system.save("stego_300.h5")
        if epoch == 449:
            encryption_model.save("encrypter_450.h5")
            decryption_model.save("decrypter_450.h5")
            stego_system.save("stego_450.h5")
        if epoch == 599:
            encryption_model.save("encrypter_600.h5")
            decryption_model.save("decrypter_600.h5")
            stego_system.save("stego_600.h5")
            
        loss_history_steg.append(np.mean(st_loss))
        loss_history_decrypter.append(np.mean(d_loss))
    
    return (loss_history_steg,loss_history_decrypter)

# %% [code] {"id":"eX_r682aLCjG","jupyter":{"outputs_hidden":false}}
result = train_model(600, 32, train_Secret, train_Cover) 

decoded =  stego_system.predict([train_Secret, train_Cover])
decoded_Secret, decoded_Cover = decoded[...,0:3], decoded[...,3:6]

diff_Secret, diff_Cover = np.abs(decoded_Secret - train_Secret), np.abs(decoded_Cover - train_Cover)

# %% [code] {"jupyter":{"outputs_hidden":false}}
print(f"Stego System Loss: {min(result[0])}")
print(f"Decryption Loss: {min(result[1])}")

# %% [markdown]
# # Testing

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:56.717409Z","iopub.execute_input":"2022-03-05T04:24:56.71764Z","iopub.status.idle":"2022-03-05T04:24:58.207572Z","shell.execute_reply.started":"2022-03-05T04:24:56.717611Z","shell.execute_reply":"2022-03-05T04:24:58.20635Z"}}
enc150 = keras.models.load_model("../input/modelfilessteg/encrypter_150.h5")
dec150 = keras.models.load_model("../input/modelfilessteg/decrypter_150.h5", custom_objects={"reveal_loss":reveal_loss})
enc300 = keras.models.load_model("../input/modelfilessteg/encrypter_300.h5")
dec300 = keras.models.load_model("../input/modelfilessteg/decrypter_300.h5", custom_objects={"reveal_loss":reveal_loss})
enc450 = keras.models.load_model("../input/modelfilessteg/encrypter_450.h5")
dec450 = keras.models.load_model("../input/modelfilessteg/decrypter_450.h5", custom_objects={"reveal_loss":reveal_loss})
enc600 = keras.models.load_model("../input/modelfilessteg/encrypter_600.h5")
dec600 = keras.models.load_model("../input/modelfilessteg/decrypter_600.h5", custom_objects={"reveal_loss":reveal_loss})
# enc = encryption_model
# dec = decryption_model
enc = [enc150,enc300,enc450,enc600]
dec = [dec150,dec300,dec450,dec600]

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:24:58.209732Z","iopub.execute_input":"2022-03-05T04:24:58.210072Z","iopub.status.idle":"2022-03-05T04:24:58.220591Z","shell.execute_reply.started":"2022-03-05T04:24:58.210028Z","shell.execute_reply":"2022-03-05T04:24:58.219431Z"}}
def get_ssim(y,y_pred):
    ssim_val = 0
    for i in range(y.shape[0]):
        ssim_val += ssim(y[i], y_pred[i],data_range=y[i].max() - y[i].min(), multichannel=True)
    
    return ssim_val / y.shape[0]

def get_mse(y,y_pred):
    return mean_squared_error(y,y_pred)

def get_normalized_mse(y,ypred):
    return normalized_root_mse(y,ypred)

def get_psnr(y,y_pred):
    psnr_val = 0
    for i in range(y.shape[0]):
        psnr_val += peak_signal_noise_ratio(y[i], y_pred[i],data_range=y[i].max() - y[i].min())
    
    return psnr_val / y.shape[0]

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:58.222508Z","iopub.execute_input":"2022-03-05T04:24:58.222913Z","iopub.status.idle":"2022-03-05T04:24:58.231472Z","shell.execute_reply.started":"2022-03-05T04:24:58.222868Z","shell.execute_reply":"2022-03-05T04:24:58.230445Z"}}
test_Secret = X_test[0:X_test.shape[0] // 2]
test_Cover = X_test[X_test.shape[0] // 2:]

# X_train = np.load("../input/skincancer/X_train_updated.npy") 
# X_test = np.load("../input/skincancer/X_test_updated.npy")

# X_train = normalize(X_train)
# X_test = normalize(X_test)

# test_Secret = X_test[0:X_test.shape[0] // 2]
# test_Cover = X_test[X_test.shape[0] // 2:-1]


# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:24:58.234047Z","iopub.execute_input":"2022-03-05T04:24:58.23525Z","iopub.status.idle":"2022-03-05T04:25:15.909833Z","shell.execute_reply.started":"2022-03-05T04:24:58.235201Z","shell.execute_reply":"2022-03-05T04:25:15.908565Z"}}
for i in range(4):
    x = enc[i].predict([test_Secret,test_Cover])
    ypred = dec[i].predict([x])
    y = denormalize(test_Secret)
    y_pred = denormalize(ypred)
    print(f"Mean SSIM:{get_ssim(y,y_pred)}")
    print(f"MSE:{get_mse(y,y_pred)}")
    print(f"Normalized MSE:{get_normalized_mse(y,y_pred)}")
    print(f"PSNR:{get_psnr(y,y_pred)}")
    print("\n")

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:25:15.913245Z","iopub.execute_input":"2022-03-05T04:25:15.913494Z","iopub.status.idle":"2022-03-05T04:25:17.102798Z","shell.execute_reply.started":"2022-03-05T04:25:15.913463Z","shell.execute_reply":"2022-03-05T04:25:17.101788Z"}}
x = enc[3].predict([test_Secret,test_Cover])
ypred = dec[3].predict([x])

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:25:17.10433Z","iopub.execute_input":"2022-03-05T04:25:17.104649Z","iopub.status.idle":"2022-03-05T04:25:19.036233Z","shell.execute_reply.started":"2022-03-05T04:25:17.104606Z","shell.execute_reply":"2022-03-05T04:25:19.035196Z"}}
print(f"Mean SSIM:{get_ssim(y,y_pred)}")
print(f"MSE:{get_mse(y,y_pred)}")
print(f"Normalized MSE:{get_normalized_mse(y,y_pred)}")
print(f"PSNR:{get_psnr(y,y_pred)}")

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:19.037893Z","iopub.execute_input":"2022-03-05T04:25:19.038318Z","iopub.status.idle":"2022-03-05T04:25:19.053763Z","shell.execute_reply.started":"2022-03-05T04:25:19.03826Z","shell.execute_reply":"2022-03-05T04:25:19.052211Z"}}
def visualize_result(n, show_difference = False, show_gray = False, cover = None, cover_prime = None, secret = None, secret_prime = None):

    def rgb2gray(rgb):
        return np.dot(rgb[...,:3], [0.299, 0.587, 0.114])

    def show_image(img, n_rows, n_col, idx, gray = False, first_row=False, title=None):
        
        ax = plt.subplot(n_rows, n_col, idx)
        
        if gray:
            plt.imshow(rgb2gray(img), cmap = plt.get_cmap('gray'))
        else:
            plt.imshow(img)
            
        ax.get_xaxis().set_visible(False)
        ax.get_yaxis().set_visible(False)
        
        if first_row:
            plt.title(title)

    plt.figure(figsize=(14, 15))
    
#     rand_indx = [random.randint(0, cover.shape[0]) for x in range(n)]
    rand_indx = [531, 528, 126, 600, 467]
    
    for i, idx in enumerate(rand_indx):
        
        n_col = 6 if show_difference else 4
        
        show_image(cover[idx], n, n_col, i * n_col + 1, gray= show_gray, first_row=i==0, title='Cover')
        show_image(secret[idx], n, n_col, i * n_col + 2, gray= show_gray, first_row=i==0, title='Secret')
        show_image(cover_prime[idx], n, n_col, i * n_col + 3, gray= show_gray, first_row=i==0, title='Encoded Cover')
        show_image(secret_prime[idx], n, n_col, i * n_col + 4, gray= show_gray, first_row=i==0, title='Decoded Secret')
    plt.savefig("Stego.jpg")
    plt.show()

        

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:25:19.055612Z","iopub.execute_input":"2022-03-05T04:25:19.05627Z","iopub.status.idle":"2022-03-05T04:25:20.975991Z","shell.execute_reply.started":"2022-03-05T04:25:19.056222Z","shell.execute_reply":"2022-03-05T04:25:20.975007Z"}}
visualize_result(5,cover = test_Cover, cover_prime = x, secret = test_Secret, secret_prime = ypred)

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:25:20.977634Z","iopub.execute_input":"2022-03-05T04:25:20.979017Z","iopub.status.idle":"2022-03-05T04:25:21.248624Z","shell.execute_reply.started":"2022-03-05T04:25:20.978967Z","shell.execute_reply":"2022-03-05T04:25:21.247251Z"}}
img_i = keras.preprocessing.image.load_img(
    "../input/photos/2018115032.JPG", grayscale=False, color_mode="rgb",target_size=(64,64), interpolation="nearest")
x = keras.preprocessing.image.img_to_array(img_i)
x = x/255.0
f = enc[3].predict([test_Secret[0].reshape(1,64,64,3), x.reshape(1,64,64,3)])
s = dec[3].predict(f)

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:21.250424Z","iopub.execute_input":"2022-03-05T04:25:21.250736Z","iopub.status.idle":"2022-03-05T04:25:21.263195Z","shell.execute_reply.started":"2022-03-05T04:25:21.250692Z","shell.execute_reply":"2022-03-05T04:25:21.262067Z"}}
# code for displaying multiple images in one figure
# create figure

def show_images(c,s,cp,sp):
    fig = plt.figure(figsize=(10, 7))

    # setting values to rows and column variables
    rows = 1
    columns = 4

    # reading images
    Image1 = c
    Image2 = s
    Image3 = cp
    Image4 = sp

    # Adds a subplot at the 1st position
    fig.add_subplot(rows, columns, 1)

    # showing image
    plt.imshow(Image1)
    plt.axis('off')
    plt.title("Cover")

    # Adds a subplot at the 2nd position
    fig.add_subplot(rows, columns, 2)

    # showing image
    plt.imshow(Image2)
    plt.axis('off')
    plt.title("Secret")

    # Adds a subplot at the 3rd position
    fig.add_subplot(rows, columns, 3)

    # showing image
    plt.imshow(Image3)
    plt.axis('off')
    plt.title("Encoded Cover")

    # Adds a subplot at the 4th position
    fig.add_subplot(rows, columns, 4)

    # showing image
    plt.imshow(Image4)
    plt.axis('off')
    plt.title("Decoded Secret")


# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:21.269386Z","iopub.execute_input":"2022-03-05T04:25:21.269643Z","iopub.status.idle":"2022-03-05T04:25:21.620991Z","shell.execute_reply.started":"2022-03-05T04:25:21.269603Z","shell.execute_reply":"2022-03-05T04:25:21.620053Z"}}
show_images(x,test_Secret[0],f[0],s[0])

# %% [code] {"jupyter":{"outputs_hidden":false},"execution":{"iopub.status.busy":"2022-03-05T04:25:21.622574Z","iopub.execute_input":"2022-03-05T04:25:21.623614Z","iopub.status.idle":"2022-03-05T04:25:21.893289Z","shell.execute_reply.started":"2022-03-05T04:25:21.623567Z","shell.execute_reply":"2022-03-05T04:25:21.892379Z"}}
dummy  = text_to_image("hello")
visualize_image(dummy, single_img=True)

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:21.896645Z","iopub.execute_input":"2022-03-05T04:25:21.897Z","iopub.status.idle":"2022-03-05T04:25:22.245653Z","shell.execute_reply.started":"2022-03-05T04:25:21.896938Z","shell.execute_reply":"2022-03-05T04:25:22.244681Z"}}
f = enc[3].predict([normalize(np.array(dummy)).reshape(1,64,64,3), train_Cover[150].reshape(1,64,64,3)])
s = dec[3].predict(f)
plt.imsave("test.png",s[0])

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:22.247396Z","iopub.execute_input":"2022-03-05T04:25:22.247758Z","iopub.status.idle":"2022-03-05T04:25:22.595029Z","shell.execute_reply.started":"2022-03-05T04:25:22.247716Z","shell.execute_reply":"2022-03-05T04:25:22.594116Z"}}
show_images(train_Cover[150],np.array(dummy),f[0],s[0])

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:22.596836Z","iopub.execute_input":"2022-03-05T04:25:22.597576Z","iopub.status.idle":"2022-03-05T04:25:23.054621Z","shell.execute_reply.started":"2022-03-05T04:25:22.597517Z","shell.execute_reply":"2022-03-05T04:25:23.053608Z"}}
image_to_text("./test.png")

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:23.056349Z","iopub.execute_input":"2022-03-05T04:25:23.056924Z","iopub.status.idle":"2022-03-05T04:25:23.084588Z","shell.execute_reply.started":"2022-03-05T04:25:23.056875Z","shell.execute_reply":"2022-03-05T04:25:23.083621Z"}}
for layer in enc[3].layers:
    # check for convolutional layer
    if 'conv' not in layer.name:
            continue
    # get filter weights
    filters, biases = layer.get_weights()
    print(layer.name, filters.shape)

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:23.085943Z","iopub.execute_input":"2022-03-05T04:25:23.086286Z","iopub.status.idle":"2022-03-05T04:25:23.249191Z","shell.execute_reply.started":"2022-03-05T04:25:23.086241Z","shell.execute_reply":"2022-03-05T04:25:23.248204Z"}}
from matplotlib import pyplot
filters, biases = enc[3].layers[6].get_weights()
# normalize filter values to 0-1 so we can visualize them
f_min, f_max = filters.min(), filters.max()
filters = (filters - f_min) / (f_max - f_min)
# plot first few filters
n_filters, ix = 1, 1
for i in range(n_filters):
    # get the filter
    f = filters[:, :, :, i]
    # plot each channel separately
    for j in range(3):
        # specify subplot and turn of axis
        ax = pyplot.subplot(n_filters, 3, ix)
        ax.set_xticks([])
        ax.set_yticks([])
        # plot filter channel in grayscale
        pyplot.imshow(f[:, :, j], cmap = 'gray', aspect = 'auto')
        ix += 1
    # show the figure
pyplot.show()

# %% [code] {"execution":{"iopub.status.busy":"2022-03-05T04:25:23.250728Z","iopub.execute_input":"2022-03-05T04:25:23.251296Z","iopub.status.idle":"2022-03-05T04:25:23.593251Z","shell.execute_reply.started":"2022-03-05T04:25:23.251247Z","shell.execute_reply":"2022-03-05T04:25:23.592277Z"}}
model = Model(inputs=enc[3].inputs, outputs=enc[3].layers[6].output)
model.summary()
# load the image with the required shape
# get feature map for first hidden layer
feature_maps = model.predict([test_Secret[32].reshape(1,64,64,3),test_Cover[32].reshape(1,64,64,3)])
square = 2
ix = 1
for _ in range(square):
    for _ in range(square):
        # specify subplot and turn of axis
        ax = pyplot.subplot(square, square, ix)
        ax.set_xticks([])
        ax.set_yticks([])
        # plot filter channel in grayscale
        pyplot.imshow(feature_maps[0, :, :, ix-1], cmap='gray', aspect = 'auto')
        ix += 1
    # show the figure
pyplot.show()