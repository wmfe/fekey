<?php
          /*
     * ��ҳ����
     * xiaoqiang@baidu.com
     * @ ����: 
     * @ $CURRENT_NUM ��ǰҳ��ʼ��Ŀ��ֵ 
     * @ $NUM_PER_PAGE ÿҳ��ʾ������Ŀ 
     * @ $TOTAL_NUM ���������Ŀ 
     * @ $TOTAL_NUM_LIMIT ҳ�������ʾ��Ŀ 
     * @ $URL url
     */
// 	  function smarty_modifier_page($CURRENT_NUM , $NUM_PER_PAGE =10 , $TOTAL_NUM, $TOTAL_NUM_LIMIT , $URL=false,$MORE='', $PAGE_NUM_LIMIT = 10 , $SHOW_END=true)
 	  function smarty_modifier_page($pageInfo){
		  
		  
		$pageInfo_def=array(
			'pageNumLimit'=>10,
			'numberPerPage'=>10,
			'show_end'=>true,
			'more'=>'',
			'url'=>false
		);
		
		$pageInfo = array_merge($pageInfo_def,$pageInfo);
		
		$CURRENT_NUM = $pageInfo['currentNum'];
		$NUM_PER_PAGE = $pageInfo['numberPerPage'];
		$TOTAL_NUM = $pageInfo['totalNumber'];
		$TOTAL_NUM_LIMIT = $pageInfo['totalNumberLimit'];
		$PAGE_NUM_LIMIT =$pageInfo['pageNumLimit'];
		$URL = $pageInfo['url'];
		$MORE = $pageInfo['more'];
		$SHOW_END = $pageInfo['show_end'];
		
		
		if (!$URL){
			$URL=$_SERVER['REQUEST_URI'];
		}
			
		$arr = parse_url($URL);		
		if($arr['query']){
			parse_str($arr['query'],$query);
			$URL = $arr['path'];

			unset($query['pn']);
			if(count($query)){
				$URL=$URL.'?'.http_build_query($query);
			}

		}
		

        if ( $CURRENT_NUM < 0 || $TOTAL_NUM <= $NUM_PER_PAGE ) return false;

        if ( $TOTAL_NUM_LIMIT != 0 ) {
            $TOTAL_NUM =  ($TOTAL_NUM >= $TOTAL_NUM_LIMIT)? $TOTAL_NUM_LIMIT : $TOTAL_NUM;
        }
		//$CURRENT_PAGE_NUM ��ǰ��ʼҳ��
        $CURRENT_PAGE_NUM = intval($CURRENT_NUM / $NUM_PER_PAGE );
		//$TOTAL_PAGE_NUM ��ҳ��
        $TOTAL_PAGE_NUM = intval($TOTAL_NUM / $NUM_PER_PAGE );
        if ( ($TOTAL_PAGE_NUM * $NUM_PER_PAGE) < $TOTAL_NUM ) {
            $TOTAL_PAGE_NUM++;
        }
        $URL = (preg_match("/\?/",$URL))? $URL."&" : $URL."?";
        $output = "";
        $head_offset = 4;     // ��ǰҳ��ǰƫ��λ��
        $tail_offset = 5;     // ��ǰҳ���ƫ��λ��
       // ��ҳ��С��ָ��ҳ��
        if ( $TOTAL_PAGE_NUM <= $PAGE_NUM_LIMIT ) {
            $start = 0;
            $end = $TOTAL_PAGE_NUM;
        } else {
            // ��ǰҳ��ǰ
            if ( $CURRENT_PAGE_NUM <= $head_offset) {
                $start = 0;
                $end = $start + $PAGE_NUM_LIMIT;
            }
            // ��ǰҳ����
            else if ( ($CURRENT_PAGE_NUM + $tail_offset) >= $TOTAL_PAGE_NUM) {
                $start = $TOTAL_PAGE_NUM - $PAGE_NUM_LIMIT;
                $end = $TOTAL_PAGE_NUM;
            }
            // ��ǰҳ���м�
            else {
                $start = $CURRENT_PAGE_NUM - $head_offset; 
                $end = $start + $PAGE_NUM_LIMIT;
            }
            // ���1��ʧ�ˣ���Ҫ��ʾ��ҳ
            if ( $CURRENT_PAGE_NUM > $head_offset ) {
                $output .= '<a href="'.$URL.'pn=0'.$MORE.'" class="first">��ҳ</a>';
            }
        }
        // ֻҪ���ǵ�һҳ������ʾ��һҳ
        if ($start != $CURRENT_PAGE_NUM) {
            $output .= '<a href="'.$URL.'pn='.($CURRENT_NUM - $NUM_PER_PAGE).$MORE.'" class="pre">&lt;&lt;��һҳ</a>';
        }
        // ��ʾҳ��
        for ($i = $start; $i < $end; $i++) {
            $no = strlen("".($i+1));
            if ( $i == $CURRENT_PAGE_NUM ) {
                $output .= '<span class="cur no'.$no.'">'.($i+1).'</span>';
            } else {
                $output .= '<a href="'.$URL.'pn='.($i * $NUM_PER_PAGE).$MORE.'" class="no'.$no.'">'.($i+1).'</a>';
            }
        }
        // ֻҪ�������һҳ������ʾ��һҳ
        if (($CURRENT_PAGE_NUM + 1) != $TOTAL_PAGE_NUM) {
            $output .= '<a href="'.$URL.'pn='.($CURRENT_NUM + $NUM_PER_PAGE).$MORE.'" class="next">��һҳ&gt;&gt;</a>';
        }
		// ֻҪβҳû����ҳ������ʾ������ʾβҳ
		if ($SHOW_END && $end < $TOTAL_PAGE_NUM){
			$output .= '<a href="'.$URL.'pn='.(($TOTAL_PAGE_NUM-1) * $NUM_PER_PAGE).$MORE.'" class="last">βҳ</a>';
		}
        return $output;
    }
