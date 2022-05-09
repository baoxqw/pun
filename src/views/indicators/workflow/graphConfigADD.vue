<template>
    <div>
         <div id="indexType">
            <div class="pub">
                <el-button type="primary" @click="pubGraph()">发 布</el-button>
            </div>
        </div>
        <div id="container">
            <div id="stencilContainer"></div>
            <div id="canvasContainer"></div>
        </div>
        
        <el-dialog title="自定义节点" :visible.sync="dialogFormVisible" custom-class="dialog-style">
            <el-form>
                <el-form-item label="部门:" :label-width="'150'">
                    <el-select v-model="dept" filterable @change="selectDeptChange()">
                       <el-option
                        v-for="item in deptOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="岗位:" :label-width="'150'">
                    <el-select v-model="posi" filterable @focus="selectJobChange()">
                        <el-option
                            v-for="item in posiOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" plain round @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="success" round @click="confirmAdd">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="节点判断" :visible.sync="dialogFormVisible2" custom-class="dialog-style2">
            <el-form>
                <el-form-item label="" :label-width="'50'">
                    <el-select v-model="judgeOpt" filterable>
                       <el-option
                            v-for="item in judgeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" plain round @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="success" round @click="confirmJudge">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { Graph } from '@antv/x6';
    import { Addon } from '@antv/x6';
    import { Shape } from '@antv/x6';
    import $ from 'jquery';
    import qs from 'qs';
    import { handleCustomNode,loadDept,loadPosi,loadGraph,pubGraph } from '@/api/workflow/graphConfig'

    
    export default {
        name: "graphConfig",
        //components: {pagination,  crudOperation,  rrOperation, Treeselect},
        //mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
        data () {
            return {
                type: false,
                graph: null,
                ports: null,
                stencil: null,
                elementArr: new Array(),
                tmpView: null,
                optType: null, //1:add,2:modify
                baseUrl: '',
                graphParam: new Object(),
                dept: '',
                posi: '',
                deptOptions: [],
                posiOptions: [],
                dialogFormVisible: false,
                dialogFormVisible2: false,
                judgeOptions: [{
                    value: '1',
                    label: '是'
                    }, {
                    value: '2',
                    label: '否'
                    }],
                judgeOpt: ''
            }
        },
        mounted() {
            if(!this.queryMenuType()){
                return;
            }
            
            this.initAll();
            
        },
        methods : {
            //获取菜单参数
            queryMenuType(){
                this.type = this.$route.query.type;
                if(!this.type || (this.type!='ZB_ADD' && this.type!='ZB_DEL' && this.type!='ZB_UPD')){
                    this.$message.error('菜单配置有误'); 
                    return false;
                }
                return true;
            },
            initAll(){
                //初始化流程图参数
                this.initGraph();
                //初始化连接点
                this.initPorts();
                //初始化自定义图形
                this.defineElement();

                //初始化拖拽栏
                this.initStencil();
                //加载基本元素到拖拽组件1中
                this.loadStencilGroup1();
                //加载基本元素到拖拽组件2中
                this.loadStencilGroup2();

                //绑定鼠标事件
                this.bindMouseEvent();
                //加载已有流程图
                this.loadGraph();

                //初始化部门岗位
                this.initDeptPosition();
            },
            showAdd(){
                this.dept = '';
                this.posi = '';
                this.posiOptions = [];
                this.optType = 1;
                this.dialogFormVisible = true;
            },
            showJudge(view){
                this.tmpView = view;
                const lbls = view.cell.store.data.labels;
                var labelName = '';
                if(lbls){
                    labelName = lbls[0];
                }
                this.judgeOpt = labelName=='是'?'1':(labelName=='否'?'2':'');
                this.dialogFormVisible2 = true;
            },
            checkExistsNodeCount(deptId, posiId){
                var count = 0;
                $.each(this.elementArr,function(idx, item){
                    if(item.store.data.dept_id == deptId && item.store.data.posi_id == posiId){
                        count++;
                    }
                });
                return count;
            },
            createStencilNode(id, label, deptId, posiId){
                var node = this.graph.createNode({
                shape: 'custom-rect',
                label: label,
                id: id,
                dept_id: deptId,
                posi_id: posiId,
                tools: [
                    {
                    name: 'button',
                    args: {
                        markup:  [
                        {
                            tagName: 'rect',
                            selector: 'button',
                            attrs: {
                            x: -12,
                            y: -12,
                            width: 25,
                            height: 15,
                            stroke: '#DC3545',
                            'stroke-width': 1,
                            fill: 'white',
                            cursor: 'pointer'
                            }
                        },
                        {
                            tagName: 'text',
                            textContent: '删除',
                            selector: 'icon',
                            attrs: {
                            fill: '#DC3545',
                            'font-size': 10,
                            'text-anchor': 'middle',
                            'pointer-events': 'none',
                            y: '-0.1em'
                            }
                        }
                        ],
                        x: '100%',
                        y: '100%',
                        offset: { x: -50, y: -50 },
                        onClick({ view }) { 
                            showDelete(view);
                        },
                    }
                },
                    {
                    name: 'button',
                    args: {
                        markup:  [
                        {
                            tagName: 'rect',
                            selector: 'button',
                            attrs: {
                            x: -12,
                            y: -12,
                            width: 25,
                            height: 15,
                            stroke: '#DC3545',
                            'stroke-width': 1,
                            fill: 'white',
                            cursor: 'pointer',
                            },
                        },
                        {
                            tagName: 'text',
                            textContent: '修改',
                            selector: 'icon',
                            attrs: {
                            fill: '#DC3545',
                            'font-size': 10,
                            'text-anchor': 'middle',
                            'pointer-events': 'none',
                            y: '-0.1em',
                            },
                        },
                        ],
                        x: '100%',
                        y: '100%',
                        offset: { x: -21, y: -50 },
                        onClick({ view }) {
                            showModify(view);
                        }
                    },
                    }
                ]
                });
                return node;
            },
            delNode(cell){
                const nodes = this.graph.getNodes();
                for (let i = nodes.length -1; i >= 0; i--) {
                    if(nodes[i].store.data.dept_id == cell.store.data.dept_id && nodes[i].store.data.posi_id == cell.store.data.posi_id){
                        this.graph.removeNode(nodes[i]);
                    }
                }
                for(let i=0; i<this.elementArr.length; i++){
                    if(this.elementArr[i].id == cell.id){
                        this.elementArr.splice(i,1);
                        break;
                    }
                }
            },
            showPorts(ports, show){
                for (let i = 0, len = ports.length; i < len; i = i + 1) {
                    ports[i].style.visibility = show ? 'visible' : 'hidden';
                }
            },
            initDeptPosition(){
                loadDept().then(data => {
                    this.deptOptions = [];
                    this.parseDept(data.content);
                });
            },
            initStencil(){
                this.stencil = new Addon.Stencil({
                    target: this.graph,
                    groups: [
                    {
                        title: '基础节点',
                        name: 'group1',
                        graphHeight: 230,
                        layoutOptions: {
                        rowHeight: 70,
                        },
                    },
                    {
                        title: '自定义节点',
                        name: 'group2',
                        graphHeight: 520,
                        layoutOptions: {
                        rowHeight: 80
                        },	
                    }
                    ],
                    stencilGraphWidth: 370,
                    //stencilGraphHeight: 600,
                    layoutOptions: {
                        columns: 2,
                        columnWidth: 175,
                        rowHeight: 80,
                    },
                });

                $("#stencilContainer").empty();
                document.getElementById('stencilContainer').appendChild(this.stencil.container);

                //添加按钮
                var btnAdd = '<div style="position:absolute;top:4px;left:125px;z-index:10;">'+
                                '<button type="button" id="btnAdd" onclick="showAdd()">添加</button>'+
                            '</div>';
                $("#stencilContainer div.x6-widget-stencil-group:last").css("position","relative").append(btnAdd);
            },
            defineElement(){
                Graph.registerNode(
                'custom-polygon',
                {
                    inherit: 'polygon',
                    width: 90,
                    height: 50,
                    attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                        refPoints: '0,10 10,0 20,10 10,20'
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                    },
                    ports: {
                    ...this.ports,
                    items: [
                        {
                        group: 'top',
                        },
                        {
                        group: 'bottom',
                        },
                        {
                        group: 'left',
                        },
                        {
                        group: 'right',
                        },
                    ],
                    },
                },
                true,
                );

                Graph.registerNode(
                'custom-rect',
                {
                    inherit: 'rect',
                    width: 150,
                    height: 50,
                    attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF'
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                        lineHeight: '1.1em',
                        textWrap: {
                            width:-4,
                            height:'110%',
                            ellipsis: true,
                            breakWord: true,
                        }
                    },
                    },
                    ports: { ...this.ports },
                },
                true,
                );

                Graph.registerNode(
                'custom-circle',
                {
                    inherit: 'circle',
                    width: 50,
                    height: 50,
                    attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                    },
                    ports: { ...this.ports },
                },
                true,
                );

                Graph.registerNode(
                'custom-judge',
                {
                    inherit: 'polygon',
                    width: 90,
                    height: 50,
                    attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                        refPoints: '0,10 10,0 20,10 10,20'
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                    },
                    ports: { ...this.ports },
                },
                true,
                );
            },
            initGraph(){
                this.graph = new Graph({
                    container: document.getElementById('canvasContainer'),
                    width: 720,
                    height: 600,
                    mousewheel: {
                        enabled: true,
                        factor: 1.1,
                        zoomAtMousePosition: true,
                        modifiers: 'ctrl',
                        minScale: 0.5,
                        maxScale: 2,
                    },
                    panning: {
                        enabled: true, 
                        eventTypes: ['leftMouseDown']
                    },
                    grid: true,
                    scroller: {
                        enabled: true,
                        pannable: true
                    },
                    connecting: {
                        router: 'manhattan',
                        connector: {
                        name: 'rounded',
                        args: {
                            radius: 8,
                        },
                        },
                        anchor: 'center',
                        connectionPoint: 'anchor',
                        allowBlank: false,
                        snap: {
                        radius: 20,
                        },
                        createEdge() {
                        return new Shape.Edge({
                            attrs: {
                            line: {
                                stroke: '#A2B1C3',
                                strokeWidth: 2,
                                targetMarker: {
                                name: 'block',
                                width: 12,
                                height: 8,
                                },
                            },
                            },
                            zIndex: 0,
                        })
                        },
                        validateConnection({ targetMagnet }) {
                            return !!targetMagnet
                        },
                    },
                    highlighting: {
                        magnetAdsorbed: {
                        name: 'stroke',
                        args: {
                            attrs: {
                            fill: '#5F95FF',
                            stroke: '#5F95FF',
                            },
                        },
                        },
                    },
                    resizing: false,
                    rotating: false,
                    selecting: {
                        enabled: false,
                        rubberband: true,
                        showNodeSelectionBox: true,
                    },
                    snapline: true,
                    keyboard: true,
                    clipboard: true
                });
            },
            initPorts(){
                this.ports = {
                    groups: {
                        top: {
                        position: 'top',
                        attrs: {
                            circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#5F95FF',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                                visibility: 'hidden'
                            }
                            }
                        }
                    },
                    right: {
                    position: 'right',
                    attrs: {
                        circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden'
                        }
                        }
                    }
                    },
                    bottom: {
                    position: 'bottom',
                    attrs: {
                        circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden'
                        }
                        }
                    }
                    },
                    left: {
                    position: 'left',
                    attrs: {
                        circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden'
                        }
                        }
                    }
                    }
                },
                items: [
                    {
                    group: 'top',
                    },
                    {
                    group: 'right',
                    },
                    {
                    group: 'bottom',
                    },
                    {
                    group: 'left'
                    }
                ]
                };
            },
            loadGraph(){
                var param = 'procKey='+this.type;
                loadGraph(param).then(data=>{
                    this.graphParam = new Object();
                    if(!$.isArray(data) || data.length == 0){
                        return;
                    }
                    this.graphParam.id = data[0].id;
                    this.graphParam.rev = data[0].rev;
                    this.graphParam.procKey = data[0].procKey;
                    this.graph.fromJSON(JSON.parse(data[0].defByte));
                });
            },
            loadStencilGroup1(){
                const start = this.graph.createNode({
                    shape: 'custom-circle',
                    label: 'Start',
                    attrs: {
                        body: {
                            strokeWidth: 1,
                            stroke: '#5F95FF',
                            fill: '#EFF4FF'
                        }
                    }
                    });

                const end = this.graph.createNode({
                    shape: 'custom-circle',
                    label: 'End',
                    attrs: {
                        body: {
                            strokeWidth: 1,
                            stroke: '#5F95FF',
                            fill: 'lightgrey'
                        }
                    }
                    });

                const countersignStart = this.graph.createNode({
                    shape: 'custom-polygon',
                    label: '会签开始'
                    });

                const countersignEnd = this.graph.createNode({
                    shape: 'custom-polygon',
                    label: '会签结束',
                    attrs: {
                        body: {
                            strokeWidth: 1,
                            stroke: '#5F95FF',
                            fill: 'lightgrey'
                        }
                    }
                    });

              	const judge = this.graph.createNode({
                    shape: 'custom-judge',
                    label: '是否'
                });
                this.stencil.load([start, countersignStart, end, countersignEnd, judge], 'group1');
            },
            loadStencilGroup2(){
                var param = 'type=QUERY&procKey='+this.type;
                handleCustomNode(param).then(data => {
                    if(!data || data.code!="0000"){
                        this.$message.warning('加载自定义节点失败');
                        return;
                    }
                    this.elementArr = new Array();
                    if(data.data && data.data.length>0){
                        for(let i=0;i<data.data.length;i++){
                            this.elementArr.push(this.createStencilNode(data.data[i].id, data.data[i].deptName+"-"+data.data[i].postName, data.data[i].deptCode, data.data[i].postCode));
                        }
                    }
                    this.stencil.load(this.elementArr, 'group2');
                });
            },
            refreshStencilGroup2(){
                this.initStencil();
                this.loadStencilGroup1();
                this.stencil.load(this.elementArr, 'group2');
            },
            bindMouseEvent(){
                this.graph.on('node:mouseenter', () => {
                    const container = document.getElementById('canvasContainer');
                    const ports = container.querySelectorAll('.x6-port-body');
                    this.showPorts(ports, true);
                });

                this.graph.on('node:mouseleave', () => {
                    const container = document.getElementById('canvasContainer');
                    const ports = container.querySelectorAll('.x6-port-body');
                    this.showPorts(ports, false);
                });

                //tools
                this.graph.on('cell:mouseenter', ({ cell }) => {
                    var offsetWidth = 0;
                    var offsetHeight = 0;
                    var sourceShape = null;
                    if(cell.isEdge()){
                        const sourceCellId = cell.getSource().cell;
                        sourceShape = $('#canvasContainer').find("g[data-cell-id='"+sourceCellId+"']").attr('data-shape');
                    }

                    if (cell.isNode()) {
                        if(cell.store.data.shape == 'custom-polygon' || cell.store.data.shape == 'custom-judge'){
                            offsetWidth = cell.store.data.size.width - 20;
                            offsetHeight = cell.store.data.size.height/2 - 10;
                        }else{
                            offsetWidth = cell.store.data.size.width;
                            offsetHeight = 8;
                        }
                    }

                    if(cell.isEdge() && sourceShape == 'custom-judge'){
                        cell.addTools([{
                            name: 'button-remove',
                            args: {
                            x: 0,
                            y: 0,
                            offset: { x: offsetWidth, y: offsetHeight }
                            }
                        },
                        {
                            name: 'button',
                            args: {
                                markup: [
                                {
                                    tagName: 'circle',
                                    selector: 'button',
                                    attrs: {
                                    r: 7,
                                    stroke: '#fe854f',
                                    'stroke-width': 2,
                                    fill: 'white',
                                    cursor: 'pointer',
                                    },
                                },
                                {
                                    tagName: 'text',
                                    textContent: '+',
                                    selector: 'icon',
                                    attrs: {
                                    fill: '#fe854f',
                                    'font-size': 12,
                                    'font-weight': 'bold',
                                    'text-anchor': 'middle',
                                    'pointer-events': 'none',
                                    y: '0.3em',
                                    },
                                },
                                ],
                                onClick({ view }) {
                                    showJudge(view);
                                }
                            }
                        }
                        ]);
                        }else{
                                cell.addTools([{
                                name: 'button-remove',
                                args: {
                                x: 0,
                                y: 0,
                                offset: { x: offsetWidth, y: offsetHeight }
                                }
                            }
                            ]);	 	
                        }
                });

                this.graph.on('cell:mouseleave', ({ cell }) => {
                    cell.removeTools();
                });
            },
            parseDept(deptArr){
                if(!$.isArray(deptArr)){
                    return;
                }
                let obj=null;
                for(let i=0;i<deptArr.length;i++){
                    if(deptArr[i].enabled){
                        obj = new Object();
                        obj.value = deptArr[i].id;
                        obj.label = deptArr[i].name;
                        this.deptOptions.push(obj);
                    }
                    this.parseDept(deptArr[i].children);
                }
            },
            parsePosi(posiArr){
                if(!$.isArray(posiArr)){
                    return;
                }
                var obj = null;
                for(let i=0; i<posiArr.length; i++){
                    if(posiArr[i].enabled){
                        obj = new Object();
                        obj.value = posiArr[i].id;
                        obj.label = posiArr[i].name;
                        this.posiOptions.push(obj);
                    }
                };
            },
            //确认添加/修改
            confirmAdd(){
                const newDeptId = this.dept;
                const newPosiId = this.posi;
                if(newDeptId == '' || newDeptId == null || newPosiId == '' || newPosiId == null){
                    this.$message.warning('请选择部门和岗位');
                    return;
                }

                const count = this.checkExistsNodeCount(newDeptId, newPosiId);
                const newLabel = this.findLabel(this.deptOptions, newDeptId) + "-" + this.findLabel(this.posiOptions, newPosiId);

                //添加
                if(this.optType == 1){
                    if(count > 0){
                        this.$message.warning('您选择的部门和岗位已存在');
                        this.dept = '';
                        this.posi = '';
                        return;
                    }

                    let param = 'type=ADD&procKey='+ this.type + '&deptCode='+newDeptId + '&deptName=' + this.findLabel(this.deptOptions, newDeptId) +
                        '&postCode=' + newPosiId + '&postName=' + this.findLabel(this.posiOptions, newPosiId);
                    handleCustomNode(param).then(data=>{
                        this.dialogFormVisible = false;
                        if(!data || data.code!="0000"){
                            this.$message.error(data.msg);
                            return;
                        }
                        this.elementArr.push(this.createStencilNode(data.id, newLabel, newDeptId, newPosiId));
                        this.refreshStencilGroup2();
                        this.$message.success('节点添加成功');
                    });
                    return;
                }
                
                //修改
                if(this.optType == 2){
                    var cell = this.tmpView.cell;
                    const oldDeptId = cell.store.data.dept_id;
                    const oldPosiId = cell.store.data.posi_id;
                    if(newDeptId == oldDeptId && newPosiId == oldPosiId){
                        this.$message.warning('您选择的部门和岗位已存在');
                        return;
                    }
                    if(count > 0){
                        this.$message.warning('您选择的部门和岗位已存在');
                        return;
                    }
                    
                    let param = 'type=UPD&procKey='+ this.type + '&deptCode='+newDeptId + '&deptName=' + this.findLabel(this.deptOptions, newDeptId) +
                        '&postCode=' + newPosiId + '&postName=' + this.findLabel(this.posiOptions, newPosiId) + '&id=' + cell.id;
                    handleCustomNode(param).then(data=>{
                        this.dialogFormVisible = false;
                        if(!data || data.code!="0000"){
                            this.$message.error(data.msg);
                            return;
                        }
                         //处理流程图中的节点
                        const nodes = this.graph.getNodes();
                        for (let i = nodes.length -1; i >= 0; i--) {
                            if(nodes[i].store.data.shape != "custom-rect"){
                                continue;
                            }
                            if(nodes[i].store.data.dept_id == oldDeptId && nodes[i].store.data.posi_id == oldPosiId){
                                nodes[i].store.data.dept_id = newDeptId;
                                nodes[i].store.data.posi_id = newPosiId;
                                nodes[i].label = newLabel;
                            }
                        }
                        //处理数组中的节点
                        for(let i=0;i<this.elementArr.length;i++){
                            if(this.elementArr[i].id == cell.id){
                                this.elementArr[i].store.data.dept_id = newDeptId;
                                this.elementArr[i].store.data.posi_id = newPosiId;
                                this.elementArr[i].label = newLabel;
                            }
                        }
                            
                        //刷新group2
                        this.refreshStencilGroup2();
                        this.$message.success('节点修改成功');
                    });
                }
            },
            //确认删除
            confirmDel(){
                var cell = this.tmpView.cell;
                const param = 'type=DEL&procKey=' + this.type + '&id=' + cell.id;
                handleCustomNode(param).then(data => {
                    this.dialogFormVisible = false;
                    if(!data || data.code!="0000"){
                        this.$message.error(data.msg);
                        return;
                    }
                    this.delNode(cell);
                    cell.removeTools();
                    cell.remove();
                    this.refreshStencilGroup2();
                    this.$message.success('节点删除成功');
                });
            },
            //确认设置判断
            confirmJudge(){
                var cell = this.tmpView.cell;
                if(this.judgeOpt!=1 && this.judgeOpt!=2){
                    return;
                }
                const labelName = (this.judgeOpt==1?"是":"否");
                cell.setLabels([labelName]);
                this.dialogFormVisible2=false;
            },
            showModify(view){
              let p = new Promise((resolve,reject)=>{
                this.tmpView = view;
                this.dept = view.cell.store.data.dept_id;
              }).then(loadPosi(qs.stringify({deptId:this.dept})).then(data => {
                    this.posiOptions = [];
                    this.parsePosi(data.content);
                    this.posi = view.cell.store.data.posi_id;
                    this.optType = 2;
                    this.dialogFormVisible = true;
                  })
              );
            },
            showDelete(view){
                this.tmpView = view;
                this.$confirm('确认删除该自定义节点吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.confirmDel();
                });
            },
            findLabel(arr, id){
                return arr.find((item) => item.value == id).label;
            },
            pubGraph(){
                var json = this.graph.toJSON();
                this.graphParam.status = "1";
                this.graphParam.procKey = this.type;
                this.graphParam.name = this.type == 'ZB_ADD'? '指标新增流程':(this.type == 'ZB_UPD'?'指标修改流程':'指标删除流程');
                this.graphParam.defByte = JSON.stringify(json);
 
                pubGraph(this.graphParam).then(data=>{
                     if(!data || data.code!="0000"){
                        this.$message.error(data.msg);
                        return;
                    }
                    this.$message.success('发布成功');
                    this.loadGraph();
                });
            },
            selectDeptChange(){
                loadPosi(qs.stringify({deptId:this.dept})).then(data => {
                    this.posiOptions = [];
                    this.parsePosi(data.content);
                });
                this.posi = ''
            },
            selectJobChange(){
               if (this.dept == null || this.dept.length == 0) {
                   this.$message.error({
                       message: '请先选择部门！'
                   })
               }
            }
        },
        created() {
            window.showAdd = this.showAdd;
            window.showModify = this.showModify;
            window.showDelete = this.showDelete;
            window.showJudge = this.showJudge;
        }
    }
</script>

<style scoped>
    #indexType {
        margin: 2px auto;
        width: 1100px;
        overflow: auto;
    }
    #indexType>div.pub {
        float: right;
        text-align: right;
        width: 100px;
    }
    #container {
        display: flex;
        width: 1100px;
        border: 1px solid #dfe3e8;
        margin:  auto;
    }
    #stencilContainer {
        height: 600px;
        width: 380px;
        position: relative;
        border-right: 1px solid #dfe3e8;
    }
    #canvasContainer {
        height: 100%;
    }
    #stencilContainer div.x6-widget-stencil-group h3 {
        font-size: 1.05em;
        font-weight: normal;
    }
    .x6-widget-stencil  {
        background-color: #fff;
    }
    .x6-widget-stencil-title {
        background-color: #fff;
    }
    .x6-widget-stencil-group-title {
        background-color: #fff !important;
    }
    .x6-widget-transform {
        margin: -1px 0 0 -1px;
        padding: 0px;
        border: 1px solid #239edd;
    }
    .x6-widget-transform > div {
        border: 1px solid #239edd;
    }
    .x6-widget-transform > div:hover {
        background-color: #3dafe4;
    }
    .x6-widget-transform-active-handle {
        background-color: #3dafe4;
    }
    .x6-widget-transform-resize {
        border-radius: 0;
    }
    .x6-widget-selection-inner {
        border: 1px solid #239edd;
    }
    .x6-widget-selection-box {
        opacity: 0;
    }
</style>
<style>
    .dialog-style {
        width: 300px !important;
    }
    .dialog-style2 {
        width: 220px !important;
    }
</style>