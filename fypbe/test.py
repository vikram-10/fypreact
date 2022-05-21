from tensorflow import keras
import tensorflow as tf
import matplotlib.pyplot as plt
import tensorflow.keras.backend as K
import sys
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"


beta = 0.75 
def reveal_loss(secret, secret_prime):
    return  beta * K.sum(K.square(secret - secret_prime)) +  tf.math.reduce_sum(1 - tf.image.ssim(secret, secret_prime,max_val = 1)).numpy()

encrypter = keras.models.load_model("encrypter_600.h5")
decrypter = keras.models.load_model("decrypter_600.h5", custom_objects={"reveal_loss":reveal_loss})

print(sys.argv[1],sys.argv[2])

img_s = keras.preprocessing.image.load_img(sys.argv[1], grayscale=False, color_mode="rgb",target_size=(64,64), interpolation="nearest")
img_c = keras.preprocessing.image.load_img(sys.argv[2], grayscale=False, color_mode="rgb",target_size=(64,64), interpolation="nearest")

secret = keras.preprocessing.image.img_to_array(img_s)
cover = keras.preprocessing.image.img_to_array(img_c)

secret = secret/255.0
cover = cover/255.0

stego_img = encrypter.predict([secret.reshape(1,64,64,3), cover.reshape(1,64,64,3)])
arr = stego_img[0]
arr [arr < 0] = 0
arr [arr > 1] = 1
stego_img[0] = arr

secret_img = decrypter.predict(stego_img)
arr = secret_img[0]
arr [arr < 0] = 0
arr [arr > 1] = 1
secret_img[0] = arr

plt.imsave("testStego.jpeg",stego_img[0])
plt.imsave("testSecret.jpeg",secret_img[0])


