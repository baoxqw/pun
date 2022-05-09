// toolbar工具栏的工具选项（默认展示全部）
const contentToolOptions = [
    ['bold', 'italic', 'underline', 'image', 
    {'color': [] }, { 'background': [] },
    { 'size': ['small', false, 'large', 'huge'] }]
];
const titleToolOptions = [
    ['bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }]
];
export default {
    contentModules: {
        toolbar: {
            container: contentToolOptions, // 工具栏选项
        }
    },
    titleModules: {
        toolbar: {
            container: titleToolOptions, // 工具栏选项
        }
    }
};
