/*
 * @Author: liuyongning 
 * @Date: 2019-01-21 18:35:31 
 * @Last Modified by: liuyongning
 * @Last Modified time: 2019-01-21 21:14:00
 */
/*
    这是首页 读取文件
*/
var data=[];
var currydate=[];
var name ;
var type ;
var value ;
var dateName ;
var date = [];
$('#inputfile').change(function () {
    $('inputfile').attr('hidden', true);
    var r = new FileReader();
    r.readAsText(this.files[0], "gbk");

    r.onload = function () {
        //读取完成后，数据保存在对象的result属性中
        //D3 （Data-Driven Documents）
        //是基于数据的文档操作javascript库，D3能够把数据和HTML、SVG、CSS结合起来，创造出可交互的数据图表。
         data = d3.csvParse(this.result);//经过d3 转换成json格式        
        // try{
            initdata();
        draw();
        // }catch(error){
        //     alert(error);
        // }
    }
});

var cishu = 0;
function initdata(){
    document.getElementById("inputfile").style.display = "none";//控件隐藏 --控件出现：document.getElementById("EleId").style.display="inline";
    document.getElementById("before").style.display="inline"//控件隐藏 --控件出现：document.getElementById("EleId").style.display="inline";
    document.getElementById("next").style.display="inline"//控件隐藏 --控件出现：document.getElementById("EleId").style.display="inline";
    document.getElementById("stylebtn").style.display="inline"
    document.getElementById("autoBefor").style.display="inline"
    console.log(data);
    console.log(data.columns[0]);
     name = data.columns[0];
     type = data.columns[1];
     value = data.columns[2];
     dateName = data.columns[3];
    date = [];//创建一个日期的数组。
    //遍历数据对象，如果这个日期没有出现 就加入到date数组里。如果已经出现了就跳过。
     currydate = [];
    data.forEach(element => {
        if (date.indexOf(element[dateName]) == -1) {
            date.push(element[dateName]);
        }
        if(element[dateName]==date[0]){
            currydate.push(element);
        }
    })

    var label=document.getElementById("year"); 
    label.innerText=date[0]; 
}







/**
 * @description
 * @author liuyongning
 * @date 2019-01-21
 * @param {*} data
 */
function draw() {









    console.log("draw里")
    console.log(data,"data");
    console.log(currydate,"currydate");
    






    /***
    const svg = d3.select("#svg").append("svg").attr("width","300").attr("height","300");
    //线性比例尺   scale是缩放的意思， linear 是线性的意思。 输入0-10000的值 输出为0-200
    const xScale = d3.scaleLinear().domain([0,1000]).range([0,200]);

    //定义一个坐标轴
    //1.生成一个左坐标轴
    const  axis = d3.axisLeft(xScale);
    const gAxis = svg.append("g").attr("transform","translate(50,10)");
    gAxis.call(axis);
    ***/
    const svg = d3.select("#svg");
    const height = svg.attr("height");
    const width = svg.attr("width");
    svg.selectAll("g").remove()
    const padding = {
        top: 20,
        left: 100,
        right: 20,
        bottom: 20
    };
    const xAxisWidth = width - padding.left - padding.right;
    const yAxisWidth = height - padding.top - padding.bottom;

    //生成十个随机颜色的方法。
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    var yScale,xScale;
    yScale = d3.scaleBand().domain(currydate.map(o => o[name])).range([0,yAxisWidth]);
    xScale = d3.scaleLinear().domain([0, d3.max(currydate.map((o, i) => Number(o[value])))]).rangeRound([0, xAxisWidth]);
    //坐标轴的画法
    const xAxis = d3.axisBottom(xScale);
    const gX = svg.append("g").attr("transform", `translate(${padding.left},${height - padding.bottom})`);
    gX.call(xAxis);
    const yAxis = d3.axisLeft(yScale);
    const gY = svg.append("g").attr("transform", `translate(${padding.left},${height - yAxisWidth - padding.bottom})`);
    gY.call(yAxis);
    console.log("数据初始化：")
    updateValue(currydate);
    updateTextNumber(currydate);

    function updateValue(dateset){
        svg.selectAll("g").remove();
        yScale = d3.scaleBand().domain(currydate.map(o => o[name])).range([0,yAxisWidth]);
        xScale = d3.scaleLinear().domain([0, d3.max(currydate.map((o, i) => Number(o[value])))]).rangeRound([0, xAxisWidth]);
        //坐标轴的画法
        const xAxis = d3.axisBottom(xScale);
        const gX = svg.append("g").attr("transform", `translate(${padding.left},${height - padding.bottom})`);
        gX.call(xAxis);
        const yAxis = d3.axisLeft(yScale);
        const gY = svg.append("g").attr("transform", `translate(${padding.left},${height - yAxisWidth - padding.bottom})`);
        gY.call(yAxis);
        var update = svg.selectAll("rect").data(dateset.map((o, i) => o));
        var enter = update.enter();
        var exit = update.exit();
            update.transition().delay(0) .duration(1000).attr("fill", (d, i) => color(i))
                .attr("y", (d, i) => padding.top + yScale(d[name]))
                .attr("x", padding.left)
                .attr("height", yScale.bandwidth())
                .attr("width", d => xScale(d[value]));
            enter.append("rect").attr("fill", (d, i) => color(i)).transition().delay(0) .duration(1000)
                .attr("y", (d, i) => padding.top + yScale(d[name]))
                .attr("x", padding.left)
                .attr("height", yScale.bandwidth())
                .attr("width", d => xScale(d[value]));
            exit.remove();
    }
    function updateTextNumber(dateset){
        var update = svg.selectAll(".number").data(dateset.map((o, i) => o));
        var enter = update.enter();
        var exit = update.exit();
        enter.append("text").attr("fill", "white")
            .attr("class", "number").transition().delay(0).duration(1000)
            .attr("font-size", "14px").attr("text-anchor", "middle")
            .attr("y", (d, i) => padding.top + yScale(d[name]))
            .attr("x", (d, i) => padding.left + xScale(d[value]))
            .text(d => d[value])
            .attr("dy", yScale.bandwidth())  // dx,dy 偏移量是相对于x y ; x y 是绝对位置，dx dy 是相对位置。
            .attr("dx", "-5em")
        //update.transition().delay(0).duration(20000)
        update.transition().delay(0).duration(1000)
        .attr("fill", "white")
                .attr("y", (d, i) => padding.top + yScale(d[name]))
                .attr("x", (d)=>padding.left+xScale(d[value]))
                .attr("height", yScale.bandwidth())
                .attr("width", d => xScale(d[value]))
                .text(d=>d[value])
                .attr("dy", yScale.bandwidth())  // dx,dy 偏移量是相对于x y ; x y 是绝对位置，dx dy 是相对位置。
                .attr("dx", "-5em")
        exit.remove();
    }

    // console.log("变化")
    // var currydate = [];
    // data.forEach(element => {
    //     if (date.indexOf(element[dateName]) == -1) {
    //         date.push(element[dateName]);
    //     }
    //     if(element[dateName]==date[30]){
    //         currydate.push(element);
    //     }
    // });

   


    // updateValue(currydate);
    // updateTextNumber(currydate);




console.log("气泡前")
console.log(data);
console.log(currydate);





    //----------------------------------------------------------------------------------------------------------气泡图----------------------------------------------------------------------------------------
    const svgBubble = d3.select("#svgBubble");
    const Bubbleheight = svgBubble.attr("height");
    const Bubblewidth = svgBubble.attr("width");
    const svgBubblepadding = {
        top: 0,
        left: 20,
        right: 20,
        bottom: 20
    };
    svgBubble.selectAll("g").remove();
    let chart = d3.select("#svgBubble");
    let z = d3.scaleOrdinal(d3.schemeCategory10);// 通用线条的颜色
    let g = chart.append("g").attr("transform", "translate(" + svgBubblepadding.left + "," + svgBubblepadding.top + ")"); // 设最外包层在总图上的相对位置
    let root = d3.hierarchy({children:currydate}) //数据分层
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.value - a.value; });
        let pack = d3.pack() // 构建打包图
            .size([Bubblewidth - 2, Bubbleheight - 2])
            .padding(3);
        pack(root);
        let node = g.selectAll("g") // 定位到所有圆的中点，画g
        .data(root.descendants())
        .enter().append("g")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .attr("class", function(d) { return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root"); })
          .style("cursor", "pointer")
          .style("fill-opacity", "0.8")
          .each(function(d) { d.node = this; })
          .on("mouseover", hovered(true))
          .on("mouseout", hovered(false));

        node.append("circle") // 画圈圈
              .attr("id", function(d) { 
                return 'r' + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y);  // 用r+x+y生成唯一id，原创思路
              })
              .style("fill", function(d) { return color(d.depth); }) 
              .attr("r", 0)            
              .transition()
              .duration(50)
              .delay(function (d, i) { return i * 50; })  
              .attr("r", function(d) { return d.r; });
        let leaf = node.filter(function(d) { return !d.children; }); // 筛选出叶子节点
        leaf.append("clipPath") // 增加遮罩防止文字超出圆圈
          .attr("id", function(d) { return 'clip-r' + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y); })
            .append("use") // 大小引用圈圈的大小
          .attr("xlink:href", function(d) { return '#r' + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y); });
        leaf.append("text") // 输出叶子文字
          .attr("clip-path", function(d) { return "url(#clip-r" + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y) + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.data.name; })
       // .data(function(d) { return d.name; })
        .enter().append("tspan")
          .attr("x", 0)
          .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 12; })
          .text(function(d) { return d; });
        node.append("title") // 输出Title，mouseover显示
        .text(function(d) { return d.value ; })
         // .text(function(d) { return d.data.name + '\n' + d.value ; });
        let notLeaf = node.filter(function(d) { return d.depth === 1; }); // 筛选出四大一线城市节点
        // notLeaf.append("text") // 输出四大一线城市的名字
        // .selectAll("tspan")
        // .data(function(d) { return d.data.name; })
        // .enter().append("tspan")
        //   .style("fill", "#fff")
        //   .style("font-size","42px")
        //   .attr("x", 0)
        //   .attr("y", function(d, i, nodes) { return 70 + (i - nodes.length / 2 - 0.5) * 70; })
        //   .text(function(d) { return d; });   
          function hovered(hover) { // mouseover把所有老祖宗都圈线
            return function(d) {
              d3.selectAll(d.ancestors().map(function(d) { return d.node; })).classed("node--hover", hover);
            };
          }
//---------------------------------------------------------------------------------------------折线图----------------------------------------------------------------------------------------------------------------
    var befordata = [];
    currydate.forEach(
        element=>{
            if(befordata.indexOf(currydate[name])==-1){
                befordata.push(element)
            }
        }
    )
    currydate = currydate.map(o=>Number(o[value]))
    console.log(currydate,"\n----------currydate")
    const svgLine = d3.select("#svgLine");
    svgLine.selectAll("g").remove()
    const lineHeight = svgLine.attr("height");
    const lineWidth = svgLine.attr("width");
    const linePadding = {
        top: 20,
        left: 40,
        right: 20,
        bottom: 300
    };
    const linexAxisWidth = lineWidth - linePadding.left - linePadding.right;
    const lineyAxisWidth = lineHeight - linePadding.top - linePadding.bottom;
   const xScaleLine = d3.scaleBand().domain(currydate.map((d,i)=>i)).range([0,linexAxisWidth]);
   const  yScaleLine = d3.scaleLinear().domain([d3.max(currydate),0]).rangeRound([ 0,lineyAxisWidth]);

//    const yScaleLine = d3.scaleLinear().domain([d3.max(currydate),0]).rangeRound([0, lineyAxisWidth]);
//    const  xScaleLine = d3.scaleBand().domain(currydate.map(o => o[name])).range([0,linexAxisWidth]);

    // //坐标轴的画法
    const xAxisLine = d3.axisBottom(xScaleLine);
    const gXLine = svgLine.append("g").attr("transform", `translate(${linePadding.left},${lineHeight - linePadding.bottom})`).attr("id","lineXtext");
    gXLine.call(xAxisLine);
    const yAxisLine = d3.axisLeft(yScaleLine);
    const gYLine = svgLine.append("g").attr("transform", `translate(${linePadding.left},${lineHeight - lineyAxisWidth - linePadding.bottom})`);
    gYLine.call(yAxisLine)
  

    let linePath = d3.line().curve(d3.curveBasis)
            .x((d,i) => xScaleLine(i)+linePadding.left+xScaleLine.bandwidth()/2)
            .y(d => lineHeight-linePadding.bottom-(yScaleLine(0)-yScaleLine(d)))


 //做成平滑的曲线
    // const linePath = d3.line().curve(d3.curveBasis).x((d,i)=>xScaleLine(i)+linePadding.left+xScaleLine.bandwidth()/2)
    //                  .y(d=>lineHeight-linePadding.bottom-(yScale(0)-yScale(d)));

    // svgLine.append("path").attr('d',linePath(lineValue)).attr("stroke","#000").attr("stroke-width","3px")
    // .attr("fill","none");

//做成折线
svgLine.selectAll("path").remove()
    svgLine.append("path").attr('d',linePath(currydate)).attr("stroke",color(cishu)).attr("stroke-width","3px")
            .attr("fill","none")

   svgLine.selectAll('#lineXtext').remove();


    svgLine.append("g").transition()
    .attr("transform", `translate(${linePadding.left},${lineHeight - linePadding.bottom})`).attr("dx","5em")
    .attr("id","lineXtext").call(d3.axisBottom( d3.scaleBand().domain(befordata.map((d,i)=>d[name])).range([0,linexAxisWidth])))

   svgLine.selectAll('#lineXtext').selectAll("text").attr("transform", "rotate(90)")
cishu++;
}


/**
 * 
 * 按钮的逻辑思路
 */

var beforeBtn = document.getElementById('autoBefor');

var stylebtn = document.getElementById('stylebtn');

var beforeStylebtntime;

var stylebtntime;



//下一个
var nextT=0;
function clickChange(e){
    nextT++;
    console.log('data=',data);
    console.log('date=',date);
    var length=date.length;
    if(nextT==length){
        nextT=length-1;
        alert("这是最后一个了！" +"\n"+ "不要再点了~_~");  
        stylebtn.innerText='自动向后';
        window.clearInterval(stylebtntime);
    }else{
        currydate = [];
        //var num = Math.round(Math.random()*30+10)
       
        data.forEach(element => {
            // if(element[dateName]==date[num]){
            //     currydate.push(element);
            // }
                if(element[dateName]==date[nextT]){
                currydate.push(element);
            }

        })
        var label=document.getElementById("year"); 
        label.innerText=date[nextT]; 
        //$("#year").html(num); 
    
       console.log("变化里的数据：currydate",currydate);
    
        draw()
    }
}

function beforeClick(e){
    nextT--;
    console.log('data=',data);
    console.log('date=',date);
    var length=date.length;
    if(nextT<=0){
        nextT=0;
        alert("这是第一个了！" +"\n"+ "莫要再点了~~");  
        beforeBtn.innerText='自动向前';
        window.clearInterval(beforeStylebtntime);
    }else{
        currydate = [];
        data.forEach(element => {
                if(element[dateName]==date[nextT]){
                currydate.push(element);
            }

        })
        var label=document.getElementById("year"); 
        label.innerText=date[nextT]; 
        //$("#year").html(num); 
    
        draw()
    }
}

/**
 * 
 * 自动点击按钮；
 */





function styleon(){
  stylebtn = document.getElementById('stylebtn');
        // var stylebtn = document.getElementById('stylebtn');
        if(stylebtn.innerText=='自动向后'){
            stylebtn.innerText='手动变化';
            stylebtntime=window.setInterval(clickChange,2100);
        }
        else{
            stylebtn.innerText='自动向后';
            window.clearInterval(stylebtntime);
        }

}

function autoBefor(){
   beforeBtn = document.getElementById('autoBefor');

    
    //var stylebtn = document.getElementById('autoBefor');
    if(beforeBtn.innerText=='自动向前'){
        beforeBtn.innerText='手动变化';
        beforeStylebtntime=window.setInterval(beforeClick,2100);
    }
    else{
        beforeBtn.innerText='自动向前';
        window.clearInterval(beforeStylebtntime);
    }

}