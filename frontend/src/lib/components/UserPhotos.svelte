<script>
    import imag1 from "$lib/photos/Screenshot 2023-10-13 184803.png"
    import imag2 from "$lib/photos/Screenshot 2023-10-16 082536.png"

    let nodeRef;

    var clone;

function sortClick() {
  var classes = document.getElementById('btn').classList;
  if (document.getElementById('myNode')) {

    var myNode = document.getElementById('myNode');
    clone = myNode.cloneNode(true);
  }

  if (!classes.contains('firstClick')) {
    classes.add("firstClick");
    myNode.parentNode.removeChild(myNode);

  } else if (classes.contains('firstClick')) {
    classes.remove('firstClick');
    document.body.appendChild(clone);


  }

};

</script>

<div class="container">
    <img src={imag1} alt="Avatar" class="image" style="width:100%">
    <div class="middle">
        <button class = "text" > Select </button>
    </div>

  </div>

  <div class="container" bind:this={nodeRef}>
    <img src={imag2} alt="Avatar" class="image" style="width:100%">
    <div class="middle">
        <button class = "text" > Select </button>
    </div>
  </div>


<div id='btn' onClick='sortClick()'>click</div>
<div id='myNode'>removed then added</div>

  
  
<style>
    .container {
  position: relative;
  width: 50%;
}

.image {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: .5s ease;
  backface-visibility: hidden;
}

.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.container:hover .image {
  opacity: 0.3;
}

.container:hover .middle {
  opacity: 1;
}

.text {
 
  color: black;
  font-size: 16px;
  padding: 16px 32px;
}

#btn {
  cursor: pointer;
}

.firstClick {
  color: red;
}
</style>