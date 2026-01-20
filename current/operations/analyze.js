

function reset_fileupload_area(){
    $('#fileupload_userfile').prop('disabled', false).val('');
    $('#fileupload_userfile_upload').prop('disabled', false);
    $('#fileupload_userfile_reset').prop('disabled', false);
    $('#fileupload_userfile_example').prop('disabled', false);
    $('#fileupload_status').empty();
}


function init_enrichment_methods(cond=null){
    switch(cond){
        case '1col':
            $('#enrichenrichr').prop('disabled', false).prop('checked', true);
            $('#enrichHypergeometric').prop('disabled', false).prop('checked', true);
            break;
        case '2col':
            $('#enrichenrichr').prop('disabled', false).prop('checked', true);
            $('#enrichHypergeometric').prop('disabled', false).prop('checked', true);
            $('#enrichprerank').prop('disabled', false).prop('checked', true);
            $('#enrichGOAT').prop('disabled', false).prop('checked', true);
            break;
        case 'userexp':
            $('#enrichenrichr').prop('disabled', false).prop('checked', true);
            $('#enrichHypergeometric').prop('disabled', false).prop('checked', true);
            $('#enrichprerank').prop('disabled', false).prop('checked', true);
            $('#enrichGOAT').prop('disabled', false).prop('checked', true);
            $('#enrichGSEA').prop('disabled', false).prop('checked', true);
            $('#enrichssGSEA').prop('disabled', false).prop('checked', true);
            $('#enrichGSVA').prop('disabled', false).prop('checked', true);
            break;
        case 'tcgaexp':
            $('#enrichenrichr').prop('disabled', false).prop('checked', true);
            $('#enrichHypergeometric').prop('disabled', false).prop('checked', true);
            $('#enrichprerank').prop('disabled', false).prop('checked', true);
            $('#enrichGOAT').prop('disabled', false).prop('checked', true);
            break;
        default:
            $('#enrichenrichr').prop('disabled', true).prop('checked', false);
            $('#enrichHypergeometric').prop('disabled', true).prop('checked', false);
            $('#enrichprerank').prop('disabled', true).prop('checked', false);
            $('#enrichGOAT').prop('disabled', true).prop('checked', false);
            $('#enrichGSEA').prop('disabled', true).prop('checked', false);
            $('#enrichssGSEA').prop('disabled', true).prop('checked', false);
            $('#enrichGSVA').prop('disabled', true).prop('checked', false);
    }
}


function init_genelist_area(){
    //
    $('#datasourcecontent').html(`
        <label class="text-primary form-label px-2 py-2" for="textinput_genelist">Gene list</label>
        <button type="button" class="btn btn-outline-secondary mx-2 textinput_genelist_example" data-zsf-ncol="1">Example 1</button>
        <button type="button" class="btn btn-outline-secondary mx-2 textinput_genelist_example" data-zsf-ncol="2">Example 2</button>
        <textarea class="form-control" name="textinput_genelist" id="textinput_genelist" style="height:200px;" required></textarea>
        <div class="form-text">
            Please enter gene symbols, one per line, in the text area above. Gene symbols cannot contain spaces.
             For single-column input, enter only the gene symbol.
              For double-column input, separate the gene symbol and its corresponding numeric value with a space, tab, or comma.
        </div>
        <div class="alert alert-warning" role="alert">
            Please follow the above guidlines when preparing your input data.
        </div>
        <div id="fileupload_status"></div>
    `);
    // initialize textarea
    $('#textinput_genelist').attr('placeholder',
        'Option 1: single-column without header\n' +
        'CASC8\ntest_1\n' +
        'Option 2: (space, tab, or comma)-separated double-column input without header\n' +
        'CASC8,0.04\ntest_1,20'
    );
    //
    init_enrichment_methods();
    init_enrichment_methods('1col');
    add_genelist_genelistfile_parameters();
    //
    function set_genelist_anaid(){
        let fileuuid = uuidv4().replaceAll('-', '');
        $('#fileupload_status').html(`
            <div class="row mt-2">
                <label class="col-2 col-form-label">File ID</label>
                <div class="col-10">
                    <input name="fileupload_userfile_success" id="fileupload_userfile_success" type="text"
                     class="form-control" value="${fileuuid}.txt" readonly />
                </div>
            </div>
        `)
    }
    set_genelist_anaid();
    // textarea example
    $('.textinput_genelist_example').click(function(){
        fetch(`https://www.datjar.com:40015/eccdnadb/api/example/gene/list/?ngenes=${Math.random() < 0.5 ? 100 : 200}&ncolumns=${$(this).data('zsf-ncol')}`)
            .then((response) => {
                if(!response.ok){
                    throw new Error('Error: example gene list error.');
                }
                return response.json();
            })
            .then((d) => {
                let genes = [];
                $.each(d, function(k, v){
                    if (v.hasOwnProperty('rnkscore')) {
                        genes.push(v.genename + ',' + v.rnkscore);
                    }else{
                        genes.push(v.genename);
                    }
                });
                $('#textinput_genelist').val(genes.join('\n'));
            })
            .catch((err) => {
                $('#textinput_genelist').val('MYC,0.6\nPVT1,1\nCASC8,0.04\ntest_1,20\ntest2,100\nZXDC,55\nZZZ3,0.0002');
            });
    });
}


function init_genelistfile_area(){
    //
    $('#datasourcecontent').html(`
        <label class="text-success form-label px-2 py-2" for="fileupload_userfile">File upload (&le; 10 Mb)</label>
        <input class="form-control" name="fileupload_userfile" id="fileupload_userfile"
         type="file" accept=".csv, .txt, .tsv" />
        <div class="form-text">
            Please list each gene symbol on a separate line in a text file, using UTF-8 encoding and a .txt or .csv extension.
             Avoid spaces within gene symbols. The file should not contain header lines.
              For single-column data, list only the gene symbols.
               For double-column data, separate the gene symbol and its corresponding numeric value with a space, tab, or comma.
                Please note that GSEA requires double-column data.
        </div>
        <div class="my-2">
            <button type="button" class="btn btn-outline-success" id="fileupload_userfile_upload">Upload</button>
            <button type="button" class="btn btn-outline-warning" id="fileupload_userfile_reset">Clear</button>
        </div>
        <div id="fileupload_status"></div>
        <div class="alert alert-warning" role="alert">
            Please follow the above guidlines when preparing your input data.
        </div>
    `);
    //
    init_enrichment_methods();
    init_enrichment_methods('1col');
    add_genelist_genelistfile_parameters();
    // upload or reset file input
    $('#fileupload_userfile_reset').on('click', (e) => {
        reset_fileupload_area();
    });
    $('#fileupload_userfile_upload').on('click', (e) => {
        if (document.querySelector('#fileupload_userfile').files.length < 1){
            $('#fileupload_status').html('<div class="alert alert-danger" role="alert">No file</div>');
            return false;
        }
        let fileuuid = uuidv4().replaceAll('-', '');
        let file2upload = new FormData();
        file2upload.append('userfile', document.querySelector('#fileupload_userfile').files[0]);
        if (file2upload.get('userfile').size > 10e6) {
            $('#fileupload_status').html('<div class="alert alert-danger" role="alert">File too large</div>');
            return false;
        }
        $.ajax({
            url: `${AJAX_SCHEME}${AJAX_HOST}/rcdrank/api/upload/file/?fileuuid=${fileuuid}`,
            method: 'post',
            data: file2upload,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $('#fileupload_userfile_upload').prop('disabled', true);
                $('#fileupload_status').html(`
                    <div class="spinner-border text-warning" role="status"></div>
                `);
            },
            success: function (response) {
                $('#fileupload_userfile_reset').prop('disabled', true);
                $('#fileupload_userfile').prop('disabled', true);
                $('#fileupload_status').html(`
                    <div class="row">
                        <label class="col-2 col-form-label">File ID</label>
                        <div class="col-10">
                            <input name="fileupload_userfile_success" id="fileupload_userfile_success" type="text"
                             class="form-control" value="${response['name']}" readonly />
                        </div>
                    </div>
                    <div class="alert alert-success" role="alert">Success</div>
                `);
            },
            error: function (xhr, status, err) {
                $('#fileupload_status').html(`
                    <div class="alert alert-danger" role="alert">${xhr.responseJSON.msg}</div>
                `);
            },
        });
    });
}


function parse_enrichment_methods(){
    var methodStr = []
    $.each($('input[type="checkbox"]:checked'), function(k, v){
        methodStr.push($(v).val());
    });
    return methodStr.join(',');
}


function add_genelist_genelistfile_parameters(){
    $('#degSettingContainer').html(`
        <div class="card">
            <div class="card-header bg-primary-subtle">Input processing</div>
            <div class="card-body">
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="geneidtype">Gene ID type</label>
                    <div class="col-8">
                        <select class="form-select" name="geneidtype" id="geneidtype">
                            <option value="hgncsymbol" selected>HGNC symbol</option>
                            <option value="ensemblgeneid">Ensembl gene ID</option>
                            <!--option value="ncbigeneid">NCBI gene (Entrez) ID</option-->
                            <option value="uniprotac">UniProtKB accession/ID</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="numberofcolumns">Number of columns</label>
                    <div class="col-8">
                        <input class="form-control" id="numberofcolumns" name="numberofcolumns" type="number" min="1" max="2" value="1" />
                    </div>
                </div>
            </div>
        </div>
    `);
    $('#numberofcolumns').on('change', function(){
        if(this.value == 2){
            init_enrichment_methods();
            init_enrichment_methods('2col');
            $('#degSettingContainer .card .card-body').append(`
                <div id="doublecolumnsettingcontainer">
                    <div class="row mb-2">
                        <div class="col-12"><p class="text-secondary">Select a gene subset for ORA-based analysis in addition to FCS-based analysis which performs on the raw data.</p></div>
                        <div class="col-4"><div class="input-group">
                            <input class="form-control" type="number" name="genescoremin" id="genescoremin" min="-3000000000" max="3000000000" value="-65535">
                                <span class="input-group-text">&le;</span>
                        </div></div>
                        <label class="col-4 col-form-label text-center text-info">Second column value</label>
                        <div class="col-4"><div class="input-group">
                            <span class="input-group-text">&le;</span>
                            <input class="form-control" type="number" name="genescoremax" id="genescoremax" min="-3000000000" max="3000000000" value="65535">
                        </div></div>
                    </div>
                    <div class="row mb-2">
                        <label class="col-4 col-form-label text-info" for="doublecolumnseparator">Separator</label>
                        <div class="col-8">
                            <select class="form-select" name="doublecolumnseparator" id="doublecolumnseparator">
                                <option value="comma" selected>Comma</option>
                                <option value="tab">Tab</option>
                                <option value="space">Space</option>
                            </select>
                        </div>
                    </div>
                    <!--div class="row mb-2">
                        <label class="col-4 col-form-label text-info" for="doublecolumnorder">Gene importance</label>
                        <div class="col-8">
                            <select class="form-select" name="doublecolumnorder" id="doublecolumnorder">
                                < put important gene at the end of the list >
                                <option value="ascending" selected>The larger the more important</option>
                                <option value="descending">The smaller the more important</option>
                            </select>
                        </div>
                    </div-->
                </div>
            `);
        }else{
            init_enrichment_methods();
            init_enrichment_methods('1col');
            $('#degSettingContainer .card .card-body div#doublecolumnsettingcontainer').remove();
        }
    });
}


function init_expressionfiles_area(){
    init_enrichment_methods();
    init_enrichment_methods('userexp');
    add_deg_parameters();
    //
    $('#datasourcecontent').html(`
        <div class="col">
            <p>Please upload transcriptomic data, such as that generated by RNA-seq or microarray assays.
             Both of the following input fields are mandatory, one for gene expression values and
              the other for phenotypic data which depicts the condition, category or group of the sample.</p>
            <span class="badge rounded-pill text-bg-primary">1</span>
            <label class="text-success form-label px-2 py-2" for="fileupload_userfile">Expression data (&lt; 300 MB)</label>
            <input class="form-control" name="fileupload_userfile" id="fileupload_userfile"
             type="file" accept=".csv, .txt, .tsv" />
            <table class="table table-bordered caption-top">
                <caption>Please put gene expression data in a CSV/TSV file as follows.
                    Example data is available for download on the
                    <a href="help.html#exampledata" target="_blank">help</a> page.
                </caption>
                <thead>
                    <tr><th>gene id</th><th>sample1</th><th>sample2</th><th>...</th></tr>
                </thead>
                <tbody>
                    <tr><td>gene_a</td><td>value_a1</td><td>value_a2</td><td>...</td></tr>
                    <tr><td>gene_b</td><td>value_b1</td><td>value_b2</td><td>...</td></tr>
                    <tr><td>...</td><td>...</td><td>...</td><td>...</td></tr>
                </tbody>
            </table>
            <p>If you have a larger file, please contact us for support.</p>
            <div class="my-2">
                <button type="button" class="btn btn-outline-success" id="fileupload_userfile_upload">Upload</button>
                <button type="button" class="btn btn-outline-warning" id="fileupload_userfile_reset">Clear</button>
                <button type="button" class="btn btn-outline-secondary" id="fileupload_userfile_example">Example</button>
            </div>
            <div id="fileupload_status"></div>
            <div class="alert alert-warning" role="alert">
                Please follow the above guidlines when preparing your input data.
            </div>
        </div>
        <div class="w-100"></div>
        <div class="col">
            <span class="badge rounded-pill text-bg-primary">2</span>
            <label class="text-success form-label" for="textinput_samplelabel">Sample group label (must be 2 levels)</label>
            <textarea class="form-control" name="textinput_samplelabel"
             id="textinput_samplelabel" style="height:200px;" placeholder="One sample per row" required></textarea>
        </div>
    `);
    // events handle
    // upload or reset file input
    $('#fileupload_userfile_reset').on('click', (e) => {
        reset_fileupload_area();
    });
    $('#fileupload_userfile_upload').on('click', (e) => {
        if (document.querySelector('#fileupload_userfile').files.length < 1){
            $('#fileupload_status').html('<div class="alert alert-danger" role="alert">No file</div>');
            return false;
        }
        let fileuuid = uuidv4().replaceAll('-', '');
        let file2upload = new FormData();
        file2upload.append('userfile', document.querySelector('#fileupload_userfile').files[0]);
        if (file2upload.get('userfile').size > 300e6) {
            $('#fileupload_status').html('<div class="alert alert-danger" role="alert">File too large</div>');
            return false;
        }
        $.ajax({
            url: `${AJAX_SCHEME}${AJAX_HOST}/rcdrank/api/upload/file/?fileuuid=${fileuuid}`,
            method: 'post',
            data: file2upload,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $('#fileupload_userfile_upload').prop('disabled', true);
                $('#fileupload_userfile_reset').prop('disabled', true);
                $('#fileupload_userfile_example').prop('disabled', true);
                $('#fileupload_status').html(`
                    <div class="spinner-border text-warning" role="status"></div>
                    <span id="fileupload_progress" class="text-info"></span>
                `);
            },
            success: function (response) {
                // dummy success
                console.log('send file success');
            },
            error: function (xhr, status, err) {
                // dummy error
                console.log('send file error, overlook');
            },
        });
        // file upload progress
        function updateProgressBar() {
            $.getJSON(
                `${AJAX_SCHEME}${AJAX_HOST}/rcdrank/api/upload/file/progress/`,
                {'fileuuid': fileuuid},
                function(res, status, xhr){
                    //console.log(res);
                    $('#fileupload_progress').text(`${res.progress}% (${res.msg})`);
                    // when to stop checking progress
                    if (Number(res.progress) < 100) {
                        window.setTimeout(updateProgressBar, 2000); // per 2000 ms, stop when no cacheData
                    }else{
                        console.log('progress success');
                        $('#fileupload_userfile').prop('disabled', true);
                        $('#fileupload_status').html(`
                            <div class="row">
                                <label class="col-2 col-form-label">File ID</label>
                                <div class="col-10">
                                    <input name="fileupload_userfile_success" id="fileupload_userfile_success" type="text"
                                     class="form-control" value="${res['name']}" readonly />
                                </div>
                            </div>
                            <div class="alert alert-success" role="alert">Success</div>
                        `);
                    }
                }
            );
        }
        window.setTimeout(updateProgressBar, 2000); // per 2000 ms
    });
    // example file
    make_example_file();
}


function make_example_file(){
    $('#fileupload_userfile_example').click(function(e){
        $('#fileupload_userfile').prop('disabled', true).val('');
        $('#fileupload_userfile_upload').prop('disabled', true);
        $('#fileupload_userfile_reset').prop('disabled', true);
        $('#fileupload_userfile_example').prop('disabled', true);
        $('#fileformat').val('csv');
        $('#geneidtype').val('hgncsymbol');
        $('#valuetype').val('rnaseqother');
        let fileuuid = uuidv4().replaceAll('-', '');
        $('#fileupload_status').html(`
            <div class="row">
                <label class="col-2 col-form-label">File ID</label>
                <div class="col-10">
                    <input name="fileupload_userfile_success" id="fileupload_userfile_success" type="text"
                     class="form-control" value="__example_${fileuuid}.csv" readonly />
                </div>
            </div>
            <div class="alert alert-success" role="alert">Success</div>
        `);
        $('#textinput_samplelabel').val("Normal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nNormal\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor\nTumor");
    });
}


function init_tcga_area(){
    init_enrichment_methods();
    init_enrichment_methods('tcgaexp');
    add_deg_parameters();
    //
    $('#datasourcecontent').html(`
        <div class="col">
            <p>Notice</p>
            <ul>
                <li>For the <span class="text-warning">Input processing</span> settings on the right,
                 only <span class="text-bg-warning">Duplicates manipulation</span> takes effect.</li>
                <li>If there are > 500 samples, &le; 500 samples will be randomly selected for DEG detection.</li>
                <li>The group labels of TCGA samples are L0 (tumor) and L1 (normal).</li>
            </ul>
        </div>
        <div class="row">
            <label class="col-4 col-form-label" for="datasourcetcgaselect">GDC TCGA project</label>
            <div class="col-8">
                <select class="form-select" name="datasourcetcgaselect" id="datasourcetcgaselect">
                    <option value="TCGA-BLCA" selected>TCGA-BLCA</option>
                    <option value="TCGA-BRCA">TCGA-BRCA</option>
                    <option value="TCGA-CESC">TCGA-CESC</option>
                    <option value="TCGA-CHOL">TCGA-CHOL</option>
                    <option value="TCGA-COAD">TCGA-COAD</option>
                    <option value="TCGA-ESCA">TCGA-ESCA</option>
                    <option value="TCGA-GBM">TCGA-GBM</option>
                    <option value="TCGA-HNSC">TCGA-HNSC</option>
                    <option value="TCGA-KICH">TCGA-KICH</option>
                    <option value="TCGA-KIRC">TCGA-KIRC</option>
                    <option value="TCGA-KIRP">TCGA-KIRP</option>
                    <option value="TCGA-LIHC">TCGA-LIHC</option>
                    <option value="TCGA-LUAD">TCGA-LUAD</option>
                    <option value="TCGA-LUSC">TCGA-LUSC</option>
                    <option value="TCGA-PAAD">TCGA-PAAD</option>
                    <option value="TCGA-PCPG">TCGA-PCPG</option>
                    <option value="TCGA-PRAD">TCGA-PRAD</option>
                    <option value="TCGA-READ">TCGA-READ</option>
                    <option value="TCGA-SARC">TCGA-SARC</option>
                    <option value="TCGA-SKCM">TCGA-SKCM</option>
                    <option value="TCGA-STAD">TCGA-STAD</option>
                    <option value="TCGA-THCA">TCGA-THCA</option>
                    <option value="TCGA-THYM">TCGA-THYM</option>
                    <option value="TCGA-UCEC">TCGA-UCEC</option>
                </select>
            </div>
        </div>
        <div id="fileupload_status"></div>
    `);
    //
    function set_tcga_file(tcgaPrj=null){
        let fileuuid = uuidv4().replaceAll('-', '');
        $('#fileupload_status').html(`
            <div class="row mt-2">
                <label class="col-2 col-form-label">File ID</label>
                <div class="col-10">
                    <input name="fileupload_userfile_success" id="fileupload_userfile_success" type="text"
                     class="form-control" value="${tcgaPrj}_${fileuuid}.csv" readonly />
                </div>
            </div>
        `)
        $('#fileformat').val('csv');
        $('#geneidtype').val('ensemblgeneid');
        $('#valuetype').val('rnaseqcount');
    }
    // init tcga file seed
    set_tcga_file($('#datasourcetcgaselect').val());
    // change
    $('#datasourcetcgaselect').on('change', function(){
        set_tcga_file($(this).val());
    });
}


function add_deg_parameters(){
    $('#degSettingContainer').html(`
        <div class="card">
            <div class="card-header bg-primary-subtle">Input processing</div>
            <div class="card-body">
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="fileformat">File format</label>
                    <div class="col-8">
                        <select class="form-select" name="fileformat" id="fileformat">
                            <option value="csv" selected>Comma-separated values (.csv)</option>
                            <option value="tsv">Tab-separated values (.tsv)</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="valuetype">Value type</label>
                    <div class="col-8">
                        <select class="form-select" name="valuetype" id="valuetype">
                            <option value="rnaseqcount" selected>RNA-seq (raw count)</option>
                            <option value="rnaseqother">RNA-seq (other)</option>
                            <option value="microarray">Microarray</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="geneidtype">Gene ID type</label>
                    <div class="col-8">
                        <select class="form-select" name="geneidtype" id="geneidtype">
                            <option value="hgncsymbol" selected>HGNC symbol</option>
                            <option value="ensemblgeneid">Ensembl gene ID</option>
                            <!--option value="ncbigeneid">NCBI gene (Entrez) ID</option-->
                            <option value="uniprotac">UniProtKB accession/ID</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="duplicatemanipulation">Duplicates manipulation</label>
                    <div class="col-8">
                        <select class="form-select" name="duplicatemanipulation" id="duplicatemanipulation">
                            <option value="first" selected>Keep first</option>
                            <option value="last">Keep last</option>
                            <option value="max">Keep max</option>
                            <option value="min">Keep min</option>
                            <option value="mean">Calculate mean</option>
                            <option value="median">Calculate median</option>
                            <option value="drop">Drop</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header bg-primary-subtle">Differential expression setting</div>
            <div class="card-body">
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="degfc">Fold change</label>
                    <div class="col-8"><div class="input-group">
                        <span class="input-group-text">&gt;</span>
                        <input type="number" id="degfc" name="degfc" class="form-control"
                            value="2" min="1" step="0.1" />
                    </div></div>
                </div>
                <div class="row mb-2">
                    <label class="col-4 col-form-label" for="degpvalue">P value</label>
                    <div class="col-8"><div class="input-group">
                        <span class="input-group-text">&lt;</span>
                        <input type="number" id="degpvalue" name="degpvalue" class="form-control"
                            value="0.05" min="0" max="1" step="0.01" />
                    </div></div>
                </div>
            </div>
        </div>
    `)
}


function get_table_html(d){
    let tableStr = '<div class="table-responsive"><table class="table"><thead><tr>';
    $.each(d[0], function(k, v){
        tableStr += `<th>${k}</th>`;
    });
    tableStr += '</tr></thead><tbody>';
    $.each(d, function(k, v){
        tableStr += '<tr>';
        $.each(v, function(k2, v2){
            tableStr += `<td>${v2}</td>`;
        });
        tableStr += '</tr>';
    });
    tableStr += '</tbody></table></div>';
    return tableStr;
}


// Datatables row group toggle, start
function get_group_name_level(d){
    const patterns = ['_driver', '_marker', '_suppressor', '_unclassified.reg.', '_unclassified'];
    let groupLevel = patterns.some(pattern => d.includes(pattern)) ? 'group-member' : 'main-group';
    let groupName = d;
    patterns.forEach(pattern => {
        groupName = groupName.replaceAll(pattern, '');
    });
    return {groupName: groupName, groupLevel: groupLevel};

}
function dtables_toggleAndCheck(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index, 1);
      return true;
    } else {
      array.push(element);
      return false;
    }
}
const groupStates = Array(); // track toggle state for each group
// DataTables row group toggle, end


// analysis progress
let globalFlag = 1;
function checkAnalysisProgress() {
    let inputAnaId = $('#anaidtoretrieve').data('const_anaidtoretrieve');
    // check requirement
    if (!inputAnaId) return false;
    // get progress
    $.getJSON(
        `${AJAX_SCHEME}${AJAX_HOST}/rcdrank/api/analysis/result/`,
        {'anaid': inputAnaId},
        function(res, status, xhr){
            //console.log(res);
            $('#analysisresultcontainer').html(res.msg.replaceAll('\n', '<br />'));
            // when to stop checking progress
            if (! (res.msg.includes('***** Analysis completed *****') || res.msg.includes('error'))) {
                globalFlag *= -1;
                let useStyle = globalFlag > 0 ? 'text-warning' : 'text-danger';
                $('#analysisresultcontainer').html(`
                    <div>
                        ${res.msg.replaceAll('\n', '<br />')}
                    </div>
                    <div class="spinner-border ${useStyle}" role="status"></div>
                    <span class="${useStyle}">Please wait.</span>
                    <p>You can either stay on this page or save the <b class="text-primary">file ID</b> and check back latter.</p>
                `);
                window.setTimeout(checkAnalysisProgress, 2000); // per 2000 ms, stop when no cacheData
            }else if(res.msg.includes('error')){
                $('#analysisresultcontainer').html(`
                    <div>
                        ${res.msg.replaceAll('\n', '<br />')}
                    </div>
                    <p class="text-danger">Failed</p>
                `);
                //
                $('#analysisform button[type="submit"]').prop('disabled', false);
                $('#analysisform button[type="reset"]').prop('disabled', false);
                $('#analysisform input[type="radio"]').prop('disabled', false);
            }else{
                // success, show results
                console.log('analysis completed');
                $('#analysisresultcontainer').html(`
                    <div>
                        ${res.msg.replaceAll('\n', '<br />')}
                    </div>
                    <p class="text-success" role="alert">Success. Please find results below.<hr /></p>
                `);
                // console.log(res.resdata);
                var tableStr = '<table class="table table-responsive" id="enrichresultdatatable"><thead><tr><th><span class="bi-toggles2"></span></th>';
                $.each(res.resdata[0], function(k, v){
                    tableStr += `<th>${k}</th>`;
                });
                tableStr += '</tr></thead><tbody>';
                $.each(res.resdata, function(k, v){
                    var groupNameLevel = get_group_name_level(v['RCD']);
                    tableStr += `<tr data-group="${groupNameLevel.groupName}" class="${groupNameLevel.groupLevel}">`;
                    tableStr += groupNameLevel.groupLevel == 'main-group' ? '<td class="toggle-icon">+</td>' : '<td>&nbsp;&nbsp;|--</td>';
                    $.each(v, function(k2, v2){
                        tableStr += `<td>${v2}</td>`;
                    });
                    tableStr += '</tr>'
                });
                tableStr += '</tbody></table>';
                $('#analysisresultcontainer').append(`
                    <div class="row">
                        <div class="col">
                            ${tableStr}
                        </div>
                        <div class="w-100"></div>
                        <div class="col">
                            <p class="fs-3 text-primary">
                                Priority landscape&nbsp;
                                <button class="btn btn-outline-primary" id="downloadhighresolutiondiagram"">Download high resolution diagram</button>
                            </p>
                            <div id="enrich_bubbleplot" style="width: 100%; height: 600px;"></div>
                        </div>
                    </div>
                `)
                $('#downloadhighresolutiondiagram').on('click', function(){
                    window.open(`${AJAX_SCHEME}${AJAX_HOST}/rcdrank/api/download/image/?filename=${res.figfile}`, "_blank");
                })
                // datatables
                var enrichResTable = new DataTable('#enrichresultdatatable', {
                    order: {
                        idx: 1,
                        dir: 'asc'
                    },
                    pageLength: 100,
                    destroy: true,
                    buttons: [
                        'copy', 'excel', 'pdf', 'csv'
                    ],
                    layout: {
                        topStart: 'buttons'
                    },
                    columnDefs: [
                        { orderable: false, targets: 0 }
                    ],
                    drawCallback: function(settings) {
                        // Reapply group member visibility based on groupStates after each draw
                        $('#enrichresultdatatable tbody tr.group-member').each(function() {
                            var row = $(this);
                            var group = row.data('group');
                            if (groupStates.includes(group)) {
                                row.removeClass('hidden-row');
                            } else {
                                row.addClass('hidden-row');
                            }
                        });
                        // Update toggle icons for main groups
                        $('#enrichresultdatatable tbody tr.main-group').each(function() {
                            var group = $(this).data('group');
                            var icon = $(this).find('.toggle-icon');
                            icon.text(groupStates.includes(group) ? '−' : '+');
                        });
                    }
                });
                // Initially hide all group member rows
                $('.group-member').addClass('hidden-row');
                // Toggle group members on click
                enrichResTable.on('click', '.toggle-icon', function() {
                    var tr = $(this).closest('tr');
                    var group = tr.data('group');
                    var icon = $(this);

                    // Toggle group state
                    var nouse = dtables_toggleAndCheck(groupStates, group);

                    // Update visibility of group members
                    $('#enrichresultdatatable tbody tr[data-group="' + group + '"].group-member').each(function() {
                        if (groupStates.includes(group)) {
                            $(this).removeClass('hidden-row');
                        } else {
                            $(this).addClass('hidden-row');
                        }
                    });

                    // Update icon
                    icon.text(groupStates.includes(group) ? '−' : '+');

                    // Redraw table to maintain DataTables functionality
                    enrichResTable.draw(false);
                });
                // plot
                Plotly.newPlot('enrich_bubbleplot', res.figdata['data'], res.figdata['layout']);
                // switch ($('#analysistask').val()) {
                //     case 'deg':
                //         $('#analysisresultcontainer').append(`
                //             <div class="row">
                //                 <div class="col" id="deg_degvolcano" style="width: 50%; height: 700px;"></div>
                //                 <div class="col" id="deg_expheatmap" style="width: 50%;">
                //                     <img class="img-fluid" src="${res.expheatmap}" alt="exp heatmap" />
                //                 </div>
                //                 <div class="w-100"></div>
                //                 <div class="col text-primary">Differential expression profile of genes.
                //                     Fold change is estimated as smaller group label divided by greater group label.
                //                     For example, given normal and tumor as the 2 group labels,
                //                     <span class="text-warning">FC = normal / tumor</span> because normal comes before tumor
                //                     in the ascending alphabetic order. Please pay attention to the log2fc values when interpreting
                //                     the results.
                //                 </div>
                //                 <div class="col text-primary">Hierarchical clustering by the expression of differentially expressed ecDNA genes.
                //                     Please note that only a subset of genes are shown as y-axis labels when the space is not enough to show all genes.
                //                 </div>
                //                 <div class="w-100"></div>
                //                 <div class="col" id="deg_degdata">
                //                     <hr/>
                //                     <p class="text-primary">Differentially expressed ecDNA genes<p>
                //                 </div>
                //             </div>
                //         `);
                //         Plotly.newPlot('deg_degvolcano', res.degvolcano['data'], res.degvolcano['layout']);
                //         $('#deg_degdata').append(get_table_html(res.degecgdata));
                //         new DataTable('#deg_degdata table', {
                //             "destroy": true,
                //             "layout": {
                //                 "top1Start": {
                //                     "buttons": [//'copy',
                //                      {extend: 'csv', text: 'Save as csv'}]
                //                 }
                //             }
                //         });
                //         break;
                //     case 'signature':
                //         $('#analysisresultcontainer').append(`
                //             <div class="row">
                //                 <div class="col-12">
                //                     <p class="text-primary fs-3">Train test split</p>
                //                     <p>${res.datadesc}</p>
                //                     <p class="text-primary fs-3">Discovered ecDNA gene signature</p>
                //                     <p>${res.signature}<p>
                //                     <p class="text-primary fs-3">Best model performance</p>
                //                     <p>The performance of the best trained model analyzed on the test set.<p>
                //                 </div>
                //                 <div class="col">
                //                     <div id="signature_roc" style="width: 500px; height: 500px;"></div>
                //                 </div>
                //                 <div class="col">
                //                     <div id="signature_confusionmatrix" style="width: 500px; height: 500px;"></div>
                //                     <p>The class labels
                //                      <span class="text-bg-warning">&nbsp;0&nbsp;</span> and <span class="text-bg-warning">&nbsp;1&nbsp;</span>
                //                         correspond to the respective sample group labels in ascending order.
                //                     </p>
                //                 </div>
                //                 <div class="w-100"></div>
                //                 <div class="col" id="signature_detaildata"></div>
                //                 <div class="w-100"></div>
                //                 <div class="col">
                //                     <p class="text-secondary fs-3">Signature validation (optional)</p>
                //                     <p>To further validate the discovered signature on the best model in another indenpendent data set,
                //                         please use the
                //                         <a href="signaturevalidation.html?id=${inputAnaId}" target="_blank">Signature validation</a> tool.
                //                     </p>
                //                 </div>
                //             </div>
                //         `);
                //         Plotly.newPlot('signature_roc', res.roc['data'], res.roc['layout']);
                //         Plotly.newPlot('signature_confusionmatrix', res.confusionmatrix['data'], res.confusionmatrix['layout']);
                //         $('#signature_detaildata').html(`
                //             <p class="text-primary fs-3">All model performance</p>
                //             <p>The performance of all estimators (i.e., models) are trained and evaluated by 5-fold cross-validation.
                //                 The scoring grid below shows average cross-validated scores on the train set.
                //             </p>
                //         `)
                //         $('#signature_detaildata').append(get_table_html(res.modeleval));
                //         new DataTable('#signature_detaildata table', {
                //             "paging": false,
                //             "destroy": true,
                //             "layout": {
                //                 "topStart": {
                //                     "buttons": [//'copy',
                //                      {extend: 'csv', text: 'Save as csv'}]
                //                 }
                //             }
                //         });
                //         break;
                //     default:
                //         $('#analysisresultcontainer').append('<p class="text-danger">Cannot show results. Invalid setting.</p>');
                // }
                //
                $('#analysisform button[type="submit"]').prop('disabled', false);
                $('#analysisform button[type="reset"]').prop('disabled', false);
                $('#analysisform input[type="radio"]').prop('disabled', false);
            }
        }
    ).fail(function(xhr){
        try{
            $('#analysisresultcontainer').append(`<p class="text-danger">${xhr.responseJSON.msg}</p>`);
        }
        catch(err){
            $('#analysisresultcontainer').append(`
                <p class="text-danger">${err.name}: ${err.message}</p>
            `);
        }
        finally{
            $('#analysisresultcontainer').append(`<p class="text-danger">
                Automatic update of analysis progress aborted. Please check it manually.
            </p>`);
        }
    });
}


function checkAnalysisProgressManual(){
    // check requirement
    if (!$('#anaidtoretrieve').val()) return false;
    $('#anaidtoretrieve').data('const_anaidtoretrieve', $('#anaidtoretrieve').val());
    $('#analysisresultcontainer').html(`<div class="spinner-border text-warning" role="status"></div>`);
    checkAnalysisProgress();
}


$(function(){
    // initialize data source
    if ($('#datasource_genelist').prop('checked')){
        init_genelist_area();
    }
    if ($('#datasource_genelistfile').prop('checked')){
        init_genelistfile_area();
    }
    if ($('#datasource_expressionfiles').prop('checked')){
        init_expressionfiles_area();
    }
    if ($('#datasource_tcga').prop('checked')){
        init_tcga_area();
    }
    // click and show data source
    $('#datasource_genelist').on('click', () => init_genelist_area());
    $('#datasource_genelistfile').on('click', () => init_genelistfile_area());
    $('#datasource_expressionfiles').on('click', () => init_expressionfiles_area());
    $('#datasource_tcga').on('click', () => init_tcga_area());
    // reset form
    $('form#analysisform').on('reset', (e) => {
        init_genelist_area();
    });
    // submit and analyze
    $('form#analysisform').submit(function(e){
        e.preventDefault();
        // set form data to submit
        let formdata2submit = new FormData(this);
        // check requirements
        if (formdata2submit.get('datasource') != 'genelist'){
            if (!(formdata2submit.has('fileupload_userfile_success') && formdata2submit.get('fileupload_userfile_success'))) return false;
        }
        if (parse_enrichment_methods().includes(',')) {
            formdata2submit.append('enrichmentmethods', parse_enrichment_methods());
        }else{
            return false;
        }
        //console.log(formdata2submit);
        console.log('do submit');
        //return false;
        // backend analysis
        $.ajax({
            url: `${AJAX_SCHEME}${AJAX_HOST}/rcdrank/api/main/analysis/`,
            method: 'post',
            data: formdata2submit,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $('#analysisform button[type="submit"]').prop('disabled', true);
                $('#analysisform button[type="reset"]').prop('disabled', true);
                $('#analysisform input[type="radio"]').prop('disabled', true);
                $('#submitresponsestatuspanel').html(`
                    <div class="spinner-border text-warning" role="status"></div>
                `);
                $('#anaidtoretrieve').val(formdata2submit.get('fileupload_userfile_success')).data(
                    'const_anaidtoretrieve', formdata2submit.get('fileupload_userfile_success')
                );
            },
            success: function(res){
                $('#submitresponsestatuspanel').empty();
                $('#submitresponsestatuspanel').html(`
                    <p class="text-success">${res.msg}</p>
                `);
                // get analysis progress
                window.setTimeout(checkAnalysisProgress, 2000); // per 2000 ms
            },
            error: function(xhr){
                //console.log(xhr)
                try{
                    $('#submitresponsestatuspanel').html(`<p class="text-danger">${xhr.responseJSON.msg}</p>`);
                }
                catch(err){
                    $('#submitresponsestatuspanel').html(`
                        <p class="text-danger">${err.name}: ${err.message}<br/>Please try again later</p>
                    `);
                }
                finally{                    
                    $('#analysisform button[type="submit"]').prop('disabled', false);
                    $('#analysisform button[type="reset"]').prop('disabled', false);
                    $('#analysisform input[type="radio"]').prop('disabled', false);
                }
            },
            complete: function(){
                var nothingtodo = null;
            }
        });
    });
});