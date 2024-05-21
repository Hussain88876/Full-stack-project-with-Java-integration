import express, {Router} from "express"

const router = Router();

 //dummy
//dummy
let user = {
  name: 'Dummy User',
  imgurl: ''
};

//dummy
router.get("/", (req, res) => {
  res.json(user);

 
});
//dummy
router.patch("/", (req, res) => {
  const { imgurl } = req.body;
  if (imgurl) {
    user.imgurl = imgurl;
    res.sendStatus(204); 
  } else {
    res.sendStatus(404); 
  }
});



export default router